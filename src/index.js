import { randomUUID } from "node:crypto";
import express from "express";
import {
  readiness,
  trustedProxy,
  operationalEvent,
} from "./utils/operations.js";
import { createRateLimit } from "./middleware/rateLimit.js";
import mongoose from "mongoose";
import cors from "cors";
import config from "./config.js";
import { validateProductionConfig } from "./utils/validateConfig.js";

// Import routes
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import lessonRoutes from "./routes/lessons.js";
import progressRoutes from "./routes/progress.js";
import analyticsRoutes from "./routes/analytics.js";
import learningRoutes from "./routes/learning.js";
import quizRoutes from "./routes/quiz.js";
import interviewRoutes from "./routes/interviews.js";
import emailRoutes from "./routes/email.js";
import achievementRoutes from "./routes/achievements.js";
import paymentRoutes from "./routes/payment.js";
import studyRoutes from "../study/routes.js";
import novyraRoutes from "./routes/novyra.js";

const app = express();
validateProductionConfig(config);
app.set("trust proxy", trustedProxy(process.env.TRUST_PROXY)); // Explicit deployment proxy trust; direct requests cannot forge their rate-limit IP.

// Middleware
const allowedOrigins = new Set(config.CORS_ORIGINS);

app.disable("x-powered-by");
app.use((req, res, next) => {
  req.requestId = randomUUID();
  res.set("X-Request-Id", req.requestId);
  res.on("finish", () => {
    if (res.statusCode >= 500)
      console.error(
        JSON.stringify({
          requestId: req.requestId,
          method: req.method,
          route: req.route?.path || "unmatched",
          status: res.statusCode,
        }),
      );
  });
  next();
});
app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), geolocation=(), microphone=(self)",
    "Cross-Origin-Resource-Policy": "same-site",
    "Cache-Control": "no-store",
  });
  next();
});
// Correlation IDs and security headers also cover rejected origins and preflight responses.
app.use(
  cors({
    exposedHeaders: ["X-Request-Id", "Retry-After"],
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use((_req, res, next) => {
  const json = res.json.bind(res);
  res.json = (body) =>
    json(
      res.statusCode >= 500 && body?.error
        ? { error: "Service temporarily unavailable. Please retry." }
        : body,
    );
  next();
});

app.use((error, req, res, next) => {
  if (error?.message === "Origin not allowed by CORS") {
    return res.status(403).json({ error: "Origin not allowed" });
  }
  return next(error);
});

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected" });
  }

  return next();
}

const DATABASE_RETRY_DELAY_MS = 5000;
let draining = false,
  databaseRetry;

async function connectDatabase() {
  if (draining) return;
  try {
    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: process.env.NODE_ENV !== "production",
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error(
      "MongoDB connection failed; retrying",
      error?.name || "Error",
    );
    if (!draining)
      databaseRetry = setTimeout(connectDatabase, DATABASE_RETRY_DELAY_MS);
  }
}

connectDatabase();

// Routes
app.use("/api/auth", requireDatabase, authRoutes);
app.use("/api/courses", requireDatabase, courseRoutes);
app.use("/api/lessons", requireDatabase, lessonRoutes);
app.use("/api/progress", requireDatabase, progressRoutes);
app.use("/api/quiz", requireDatabase, quizRoutes);
app.use("/api/learning", requireDatabase, learningRoutes);
app.use("/api/analytics", requireDatabase, analyticsRoutes);
app.use("/api/interviews", requireDatabase, interviewRoutes);
app.use("/api/email", requireDatabase, emailRoutes);
app.use("/api/achievements", requireDatabase, achievementRoutes);
app.use("/api/payment", requireDatabase, paymentRoutes);
app.use("/api/study", requireDatabase, studyRoutes);
app.use("/api/novyra", requireDatabase, novyraRoutes);

app.get("/livez", (_req, res) => res.json({ alive: true }));
app.get("/readyz", (_req, res) => {
  const r = readiness(mongoose.connection.readyState === 1, draining);
  res.status(r.status).json(r.body);
});
app.post(
  "/api/telemetry",
  createRateLimit({ windowMs: 60000, max: 20 }),
  (req, res) => {
    if (process.env.TELEMETRY_ENABLED !== "true") return res.sendStatus(404);
    const event = operationalEvent(req.body);
    if (!event)
      return res.status(400).json({ error: "Unknown operational event" });
    console.warn(JSON.stringify({ event, requestId: req.requestId }));
    res.sendStatus(204);
  },
);
// Health check
app.get("/health", (req, res) => {
  res
    .status(readiness(mongoose.connection.readyState === 1, draining).status)
    .json({
      status: "Backend running",
      database:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      apiBase: "/api",
      scheduleVersion: "global-dhaka-day4-v4",
    });
});

app.use("/api", (req, res) =>
  res.status(404).json({ error: "API route not found" }),
);

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error?.type === "entity.too.large")
    return res.status(413).json({ error: "Request body is too large" });
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  console.error("Unhandled request error", error?.name || "Error");
  return res.status(500).json({ error: "Internal server error" });
});

// Start server
const server = app.listen(config.PORT, config.API_BIND_HOST, () => {
  console.log(`Backend running on http://localhost:${config.PORT}`);
});

async function shutdown() {
  if (draining) return;
  draining = true;
  clearTimeout(databaseRetry);
  const deadline = setTimeout(() => {
    server.closeAllConnections();
    process.exit(1);
  }, 10000);
  deadline.unref();
  const forceConnections = setTimeout(() => server.closeAllConnections(), 5000);
  forceConnections.unref();
  server.close(async () => {
    await mongoose.disconnect();
    clearTimeout(forceConnections);
    clearTimeout(deadline);
    process.exit(0);
  });
  server.closeIdleConnections();
}
process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);
