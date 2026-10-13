import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";
import authRoutes from "./auth.js";
import lessonRoutes from "./lessons.js";
import quizRoutes from "./quiz.js";
import learningRoutes from "./learning.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Lesson } from "../models/Lesson.js";
import { Quiz } from "../models/Quiz.js";
import { Progress } from "../models/Progress.js";
import { InPersonApplication } from "../models/InPersonApplication.js";
import { getLearnerProgressState } from "../services/courseProgression.js";
import config from "../config.js";

test(
  "Phase 19 learner ownership, enrollment, premium content and durable idempotent rewards",
  { skip: process.env.RUN_QUIZ_INTEGRATION !== "1" },
  async () => {
    const database = `lugaish_security_test_${process.pid}_${Date.now()}`;
    let server;
    await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`, {
      serverSelectionTimeoutMS: 5000,
    });
    try {
      await Quiz.init();
      const app = express();
      app.use(express.json());
      app.use("/api/auth", authRoutes);
      app.use("/api/lessons", lessonRoutes);
      app.use("/api/quiz", quizRoutes);
      app.use("/api/learning", learningRoutes);
      server = app.listen(0, "127.0.0.1");
      await new Promise((resolve) => server.once("listening", resolve));
      const [owner, other, none, instructor, staff, revoked] =
        await User.create([
          {
            name: "Owner",
            email: "owner@security.invalid",
            enrolledPathways: ["english"],
          },
          {
            name: "Other",
            email: "other@security.invalid",
            enrolledPathways: ["english"],
          },
          {
            name: "Unenrolled",
            email: "none@security.invalid",
            enrolledPathways: [],
          },
          {
            name: "Instructor",
            email: "instructor@security.invalid",
            role: "instructor",
          },
          {
            name: "Staff",
            email: "staff@security.invalid",
            role: "web_developer",
          },
          {
            name: "Revoked",
            email: "revoked@security.invalid",
            privateBatchAccess: true,
            privateBatchExplicitlyRevoked: true,
          },
        ]);
      const request = (user, path, body, method = body ? "POST" : "GET") =>
        fetch(`http://127.0.0.1:${server.address().port}/api/${path}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...(user
              ? {
                  Authorization:
                    "Bearer " +
                    jwt.sign({ userId: String(user._id) }, config.JWT_SECRET, {
                      expiresIn: "5m",
                    }),
                }
              : {}),
          },
          ...(body ? { body: JSON.stringify(body) } : {}),
        });
      assert.equal((await request(instructor, "auth/users")).status, 403);
      assert.equal((await request(staff, "auth/users")).status, 200);
      assert.equal((await request(owner, "quiz/submit", [])).status, 400);
      assert.equal(
        (await request(owner, "auth/in-person-batch/apply", [])).status,
        400,
      );
      assert.equal(
        (
          await request(
            staff,
            "auth/users/not-an-id/private-batch",
            { privateBatchAccess: true },
            "PATCH",
          )
        ).status,
        400,
      );
      assert.equal(
        (
          await request(
            staff,
            `auth/users/${owner._id}/private-batch`,
            { paidBatchMonths: 0 },
            "PATCH",
          )
        ).status,
        400,
      );
      const vanished = { _id: new mongoose.Types.ObjectId() };
      assert.equal((await request(vanished, "auth/me")).status, 401);
      const application = await InPersonApplication.create({
        userId: owner._id,
        fullName: "Owner",
        email: owner.email,
        phone: "123",
        adminNotes: "Internal staff review",
        paymentStatus: "paid",
        paidAmount: 100,
      });
      const payload = { fullName: "Changed", email: owner.email, phone: "456" };
      assert.equal(
        (await request(null, "auth/in-person-batch/apply", payload)).status,
        401,
      );
      assert.equal(
        (await request(other, "auth/in-person-batch/apply", payload)).status,
        403,
      );
      assert.equal(
        (
          await request(
            null,
            `auth/in-person-batch/status?email=${owner.email}`,
          )
        ).status,
        401,
      );
      assert.equal(
        (
          await request(
            other,
            `auth/in-person-batch/status?email=${owner.email}`,
          )
        ).status,
        403,
      );
      assert.equal(
        (await InPersonApplication.findById(application._id)).phone,
        "123",
      );
      const applied = await (
        await request(owner, "auth/in-person-batch/apply", payload)
      ).json();
      assert.equal(applied.application.phone, "456");
      assert.equal(applied.application.adminNotes, undefined);
      assert.equal(applied.application.userId, undefined);
      assert.equal(
        (await InPersonApplication.findById(application._id)).adminNotes,
        "Internal staff review",
      );
      assert.equal(
        (
          await request(
            staff,
            `auth/in-person-batch/applications/${application._id}`,
            { paidAmount: -1 },
            "PATCH",
          )
        ).status,
        400,
      );
      assert.equal(
        (await InPersonApplication.findById(application._id)).paidAmount,
        100,
      );
      assert.equal(
        (await (await request(owner, "auth/in-person-batch/status")).json())
          .application.adminNotes,
        undefined,
      );
      assert.equal(
        (await (await request(owner, "auth/me")).json()).inPersonBatch
          .adminNotes,
        undefined,
      );
      const course = await Course.create({
        language: "english",
        title: "Isolated security fixture",
        status: "published",
      });
      const question = {
        question: "Choose A",
        options: ["A", "B"],
        correctAnswer: 0,
        explanation: "A is the reviewed answer.",
      };
      const lesson = await Lesson.create({
        courseGeneration: course.generation,
        publicationStatus: "published",
        language: "english",
        day: 1,
        title: "Fixture lesson",
        accessTier: "premium",
        moduleType: "ai_practice",
        modulePublished: true,
        quiz: [question],
        speakingQuestions: [
          {
            id: "one",
            question: "Premium prompt",
            language: "english",
            sampleAnswer: "Premium answer",
            expectedKeywords: ["premium"],
            maxMarks: 1,
          },
        ],
      });
      await Lesson.create({
        courseGeneration: course.generation,
        publicationStatus: "published",
        language: "english",
        day: 2,
        title: "Next fixture",
        quiz: [question],
      });
      for (const path of [
        "lessons/english/1",
        "lessons/today/english",
        "lessons/english/1/speaking-practice",
      ]) {
        assert.equal((await request(none, path)).status, 403, path);
        assert.equal((await request(owner, path)).status, 403, path);
      }
      assert.equal((await request(owner, "lessons/english/2")).status, 403);
      const modules = await (
        await request(owner, "lessons/english/day-modules")
      ).json();
      assert.equal(modules.modules[0].premiumLocked, true);
      assert.deepEqual(modules.modules[0].questions, []);
      assert.equal(
        (
          await request(owner, "quiz/submit", {
            language: "english",
            day: true,
            responses: [{ selectedAnswer: 0 }],
          })
        ).status,
        400,
      );
      await Lesson.updateOne(
        { _id: lesson._id },
        { $set: { accessTier: "free" } },
      );
      const body = {
        language: "english",
        day: 1,
        responses: [{ selectedAnswer: 1 }],
        requestId: "security-request-001",
      };
      const save = Quiz.prototype.save;
      Quiz.prototype.save = async function () {
        throw new Error("Fixture write failure: internal detail");
      };
      try {
        assert.equal((await request(owner, "quiz/submit", body)).status, 503);
      } finally {
        Quiz.prototype.save = save;
      }
      assert.equal((await User.findById(owner._id)).totalXP, 0);
      assert.equal(await Quiz.countDocuments({ userId: owner._id }), 0);
      const results = await Promise.all([
        request(owner, "quiz/submit", body),
        request(owner, "quiz/submit", body),
      ]);
      assert.ok(results.every((result) => result.status === 200));
      const receipts = await Promise.all(
        results.map((result) => result.json()),
      );
      assert.equal(
        receipts.reduce((sum, r) => sum + r.xpAwarded, 0),
        500,
      );
      assert.equal(receipts[0].completedAt, receipts[1].completedAt);
      assert.equal(await Quiz.countDocuments({ userId: owner._id }), 1);
      assert.equal((await User.findById(owner._id)).totalXP, 500);
      const replay = await (await request(owner, "quiz/submit", body)).json();
      assert.equal(replay.xpAwarded, 0);
      assert.equal(replay.completedAt, receipts[0].completedAt);
      assert.equal(
        (
          await request(owner, "quiz/submit", {
            ...body,
            responses: [{ selectedAnswer: 0 }],
          })
        ).status,
        409,
      );
      assert.equal((await request(other, "quiz/submit", body)).status, 200);
      assert.equal(await Quiz.countDocuments({ requestId: body.requestId }), 2);
      const state = await getLearnerProgressState(owner, "english", 365);
      assert.deepEqual(state.completedDays, [1]);
      await Progress.updateMany(
        { userId: owner._id, language: "english" },
        { $unset: { "completedDays.0.completedAt": 1 } },
      );
      const restoredFromReceipt = await getLearnerProgressState(
        owner,
        "english",
        365,
      );
      assert.equal(
        restoredFromReceipt.currentDay,
        1,
        "missing progress timestamp must recover actual same-day quiz timestamp",
      );
      const savedProgress = await Progress.find({
        userId: owner._id,
        language: "english",
      });
      assert.equal(savedProgress.flatMap((p) => p.completedDays).length, 1);
      const overflow = await Quiz.collection.insertMany(
        Array.from({ length: 5001 }, () => ({
          userId: owner._id,
          language: "english",
          courseGeneration: course.generation,
          day: 1,
          completedAt: new Date(),
          createdAt: new Date(),
          responses: [],
          score: 0,
          totalQuestions: 1,
        })),
      );
      const bounded = await request(owner, "learning/english");
      assert.equal(bounded.status, 409);
      assert.equal((await bounded.json()).code, "REVIEW_HISTORY_LIMIT");
      assert.equal((await request(other, "learning/english")).status, 200);
      await Quiz.deleteMany({
        _id: { $in: Object.values(overflow.insertedIds) },
      });
      await Course.updateOne(
        { _id: course._id },
        { $set: { startAt: new Date(Date.now() + 86400000) } },
      );
      assert.equal((await request(owner, "lessons/english/1")).status, 403);
      assert.equal((await request(owner, "learning/english")).status, 403);
      const paid = await Course.create({
        language: "paid_batch",
        title: "Isolated private security fixture",
        status: "published",
      });
      await Lesson.create({
        courseGeneration: paid.generation,
        language: "paid_batch",
        day: 1,
        title: "Private practice",
        publicationStatus: "published",
        moduleType: "ai_practice",
        modulePublished: true,
      });
      assert.equal(
        (await request(revoked, "lessons/paid_batch/1/speaking-practice"))
          .status,
        403,
      );
      assert.equal(
        (await request(owner, "lessons/paid_batch/1/speaking-practice")).status,
        403,
      );
    } finally {
      if (server) await new Promise((resolve) => server.close(resolve));
      if (mongoose.connection.name === database)
        await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  },
);
