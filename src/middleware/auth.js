import { permitsLivePermission } from "./livePermission.js";
import jwt from "jsonwebtoken";
import config from "../config.js";
import { User } from "../models/User.js";
import { hasPermission } from "../utils/roles.js";

function getBearerToken(req) {
  const authorization = req.headers.authorization;
  if (typeof authorization !== "string") return "";
  const match = /^Bearer\s+([^\s]+)$/i.exec(authorization.trim());
  return match?.[1] ?? "";
}

// JWT integrity is not a substitute for validating the subject before it
// reaches Mongo. Never pass a client-shaped object or malformed id to findById.
export function validTokenSubject(decoded) {
  return (
    typeof decoded?.userId === "string" &&
    /^[a-fA-F0-9]{24}$/.test(decoded.userId)
  );
}

export const authMiddleware = (req, res, next) => {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (!validTokenSubject(decoded))
      return res.status(401).json({ error: "Invalid token" });
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const token = getBearerToken(req);
    if (token) {
      const decoded = jwt.verify(token, config.JWT_SECRET, {
        algorithms: ["HS256"],
      });
      if (validTokenSubject(decoded)) req.userId = decoded.userId;
    }
  } catch {
    // Public lesson reads remain public when a token is absent or stale.
  }
  next();
};

export const requirePermission = (permission) => async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("role");
    if (
      !user ||
      !hasPermission(user.role, permission) ||
      !permitsLivePermission(user.role, permission)
    ) {
      return res
        .status(403)
        .json({ error: "You do not have permission for this action" });
    }

    req.userRole = user.role;
    return next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
