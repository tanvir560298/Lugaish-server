import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";
import progressRoutes from "./progress.js";
import achievementRoutes from "./achievements.js";
import paymentRoutes from "./payment.js";
import emailRoutes from "./email.js";
import interviewRoutes from "./interviews.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Progress } from "../models/Progress.js";
import { Certificate } from "../models/Certificate.js";
import { InterviewQueueEntry } from "../models/InterviewQueueEntry.js";
import { BankSettings, PaymentNotification } from "../models/Payment.js";
import config from "../config.js";

test(
  "database/provider failures remain redacted and payment notifications remain owner scoped",
  { skip: process.env.RUN_QUIZ_INTEGRATION !== "1" },
  async () => {
    const database = `lugaish_redaction_test_${process.pid}_${Date.now()}`;
    let server;
    await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`, {
      serverSelectionTimeoutMS: 5000,
    });
    try {
      const app = express();
      app.use(express.json());
      app.use("/api/progress", progressRoutes);
      app.use("/api/achievements", achievementRoutes);
      app.use("/api/payment", paymentRoutes);
      app.use("/api/email", emailRoutes);
      app.use("/api/interviews", interviewRoutes);
      server = app.listen(0, "127.0.0.1");
      await new Promise((resolve) => server.once("listening", resolve));
      const [owner, other] = await User.create([
        {
          name: "Owner",
          email: "owner@redaction.invalid",
          enrolledPathways: ["english"],
          referralCode: "REDACTIONOWNER",
        },
        {
          name: "Other",
          email: "other@redaction.invalid",
          enrolledPathways: ["english"],
          referralCode: "REDACTIONOTHER",
        },
      ]);
      await Course.create({
        language: "english",
        title: "Isolated redaction fixture",
        status: "published",
      });
      const request = (user, path, method = "GET") =>
        fetch(`http://127.0.0.1:${server.address().port}/api/${path}`, {
          method,
          redirect: "manual",
          headers: user
            ? {
                Authorization:
                  "Bearer " +
                  jwt.sign({ userId: String(user._id) }, config.JWT_SECRET, {
                    expiresIn: "5m",
                  }),
              }
            : {},
        });
      const sensitiveError =
        "mongodb+srv://internal-user:internal-password@db.private/production?providerToken=private-token";
      const checkFailure = async (model, method, path) => {
        const original = model[method];
        model[method] = () => {
          throw Error(sensitiveError);
        };
        try {
          const response = await request(owner, path);
          assert.equal(response.status, 500, path);
          const payload = await response.json();
          assert.equal(typeof payload.error, "string");
          assert.equal(
            JSON.stringify(payload).includes("internal-"),
            false,
            path,
          );
          assert.equal(
            JSON.stringify(payload).includes("private-token"),
            false,
            path,
          );
          assert.ok(/retry|support/i.test(payload.error), path);
        } finally {
          model[method] = original;
        }
      };
      await checkFailure(Progress, "find", "progress/english");
      await checkFailure(Certificate, "find", "achievements/summary");
      await checkFailure(BankSettings, "findOne", "payment/bank-details");
      await checkFailure(User, "findById", "email/status");
      await checkFailure(User, "findById", "interviews/weekly");
      const oauthFailure = await request(
        null,
        "email/oauth/callback?state=invalid-private-token",
      );
      assert.equal(oauthFailure.status, 302);
      const location = new URL(oauthFailure.headers.get("location"));
      assert.equal(
        location.searchParams.get("mailError"),
        "Gmail connection failed. Reconnect or contact support.",
      );
      assert.equal(location.toString().includes("jwt"), false);
      assert.equal(location.toString().includes("private-token"), false);
      assert.equal(
        (await request(owner, "achievements/certificates/english/99", "POST"))
          .status,
        400,
      );
      const notification = await PaymentNotification.create({
        userId: owner._id,
        userEmail: owner.email,
        title: "Fixture reminder",
        message: "Isolated test only",
      });
      assert.equal(
        (
          await request(
            other,
            `payment/notifications/${notification._id}/dismiss`,
            "POST",
          )
        ).status,
        404,
      );
      assert.equal(
        (await PaymentNotification.findById(notification._id)).isRead,
        false,
      );
      assert.equal(
        (
          await request(
            owner,
            `payment/notifications/${notification._id}/dismiss`,
            "POST",
          )
        ).status,
        200,
      );
      assert.equal(
        (await PaymentNotification.findById(notification._id)).isRead,
        true,
      );
      assert.equal(
        (
          await request(
            owner,
            "payment/notifications/not-an-id/dismiss",
            "POST",
          )
        ).status,
        400,
      );
      const legacy = await PaymentNotification.create({
        userEmail: owner.email,
        title: "Legacy reminder",
        message: "Isolated legacy test only",
      });
      assert.equal(
        (
          await request(
            other,
            `payment/notifications/${legacy._id}/dismiss`,
            "POST",
          )
        ).status,
        404,
      );
      assert.equal(
        (
          await request(
            owner,
            `payment/notifications/${legacy._id}/dismiss`,
            "POST",
          )
        ).status,
        200,
      );
      const tester = await User.create({
        name: "Sandbox",
        email: "tester@redaction.invalid",
        role: "tester",
        enrolledPathways: ["english"],
      });
      const weekly = await (await request(owner, "interviews/weekly")).json();
      await InterviewQueueEntry.create({
        sessionKey: weekly.sessionKey,
        userId: owner._id,
        name: owner.name,
        email: owner.email,
        language: "english",
        roomIndex: 0,
        roomName: "Fixture room",
        meetUrl: "https://example.invalid/isolated-interview",
        globalSerial: 1,
        roomSerial: 1,
        status: "waiting",
      });
      const sandboxQueue = await (
        await request(tester, "interviews/weekly")
      ).json();
      assert.equal(sandboxQueue.canManageQueue, false);
      assert.deepEqual(sandboxQueue.entries, []);
      assert.equal(sandboxQueue.ownEntry, null);
      assert.equal(
        (await request(tester, "interviews/join", "POST")).status,
        200,
      );
      assert.equal(
        await InterviewQueueEntry.countDocuments(),
        1,
        "sandbox join must not add a live record",
      );
    } finally {
      if (server) await new Promise((resolve) => server.close(resolve));
      if (mongoose.connection.name === database)
        await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  },
);
