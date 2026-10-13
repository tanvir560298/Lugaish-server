import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";
import authRoutes from "./auth.js";
import learningRoutes from "./learning.js";
import quizRoutes from "./quiz.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Lesson } from "../models/Lesson.js";
import { Quiz } from "../models/Quiz.js";
import { ReviewAttempt } from "../models/ReviewAttempt.js";
import config from "../config.js";
test(
  "authenticated practice → saved mistake → targeted retry → persistent next action, with enrollment and content isolation",
  { skip: process.env.RUN_QUIZ_INTEGRATION !== "1" },
  async () => {
    const database = `lugaish_learning_test_${process.pid}_${Date.now()}`;
    let server;
    await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`);
    try {
      await ReviewAttempt.init();
      const app = express();
      app.use(express.json());
      app.use("/api/quiz", quizRoutes);
      app.use("/api/learning", learningRoutes);
      app.use("/api/auth", authRoutes);
      server = app.listen(0, "127.0.0.1");
      await new Promise((r) => server.once("listening", r));
      const [owner, other, none] = await User.create([
        {
          name: "Owner",
          email: "owner@learning.invalid",
          role: "learner",
          enrolledPathways: ["english", "arabic"],
        },
        {
          name: "Other",
          email: "other@learning.invalid",
          role: "learner",
          enrolledPathways: ["english"],
        },
        {
          name: "Not enrolled",
          email: "none@learning.invalid",
          role: "learner",
          enrolledPathways: [],
        },
      ]);
      const request = (user, path, body) =>
        fetch(`http://127.0.0.1:${server.address().port}/api/${path}`, {
          method: body ? "POST" : "GET",
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
      assert.equal((await request(null, "learning/english")).status, 401);
      assert.equal((await request(none, "learning/english")).status, 403);
      assert.equal((await request(owner, "learning/english")).status, 404);
      const course = await Course.create({
        language: "english",
        title: "Isolated developer fixture",
        status: "published",
      });
      const lesson = await Lesson.create({
        language: "english",
        courseGeneration: course.generation,
        publicationStatus: "published",
        day: 1,
        title: "Developer greeting fixture",
        quiz: [
          {
            question: "Choose the greeting",
            options: ["Hello", "Goodbye"],
            correctAnswer: 0,
            explanation: "Hello welcomes someone.",
          },
        ],
      });
      const empty = await (await request(owner, "learning/english")).json();
      assert.deepEqual(empty.items, []);
      assert.equal(empty.actions[0].kind, "lesson");
      assert.equal(empty.aiHelpAvailable, false);
      assert.equal(
        (
          await request(owner, "quiz/submit", {
            language: "english",
            day: 1,
            responses: [{ selectedAnswer: 2 }],
          })
        ).status,
        400,
      );
      const submitted = await (
        await request(owner, "quiz/submit", {
          language: "english",
          day: 1,
          responses: [{ selectedAnswer: 1 }],
        })
      ).json();
      assert.equal(submitted.correctAnswers, 0);
      assert.equal(submitted.feedback[0].correctAnswer, 0);
      const summary = await (await request(owner, "learning/english")).json();
      const item = summary.items[0];
      assert.equal(summary.actions[0].kind, "review");
      assert.equal(item.previousAnswer, 1);
      assert.equal(
        (await (await request(other, "learning/english")).json()).items.length,
        0,
      );
      const body = {
        sourceQuiz: item.sourceQuiz,
        questionIndex: 0,
        selectedAnswer: 1,
        requestId: "retry-wrong-001",
      };
      assert.equal(
        (await request(other, "learning/english/retry", body)).status,
        404,
      );
      assert.equal(
        (await request(none, "learning/english/retry", body)).status,
        403,
      );
      assert.equal(
        (
          await request(owner, "learning/english/retry", {
            ...body,
            selectedAnswer: 5,
          })
        ).status,
        400,
      );
      const wrong = await (
        await request(owner, "learning/english/retry", body)
      ).json();
      assert.equal(wrong.reviewComplete, false);
      assert.equal(wrong.isCorrect, false);
      const correctBody = {
        ...body,
        requestId: "retry-correct-002",
        selectedAnswer: 0,
      };
      const correct = await (
        await request(owner, "learning/english/retry", correctBody)
      ).json();
      assert.equal(correct.isCorrect, true);
      assert.equal(correct.xpAwarded, 0);
      const repeat = await (
        await request(owner, "learning/english/retry", correctBody)
      ).json();
      assert.equal(repeat.completedAt, correct.completedAt);
      assert.equal(await ReviewAttempt.countDocuments(), 2);
      assert.equal(
        (
          await request(owner, "learning/english/retry", {
            ...correctBody,
            selectedAnswer: 1,
          })
        ).status,
        409,
      );
      const refreshed = await (await request(owner, "learning/english")).json();
      assert.equal(refreshed.items[0].resolved, true);
      assert.equal(
        refreshed.actions.some((a) => a.kind === "review"),
        false,
      );
      await Lesson.updateOne(
        { _id: lesson._id },
        { $set: { accessTier: "premium" } },
      );
      assert.equal(
        (await (await request(owner, "learning/english")).json()).items.length,
        0,
      );
      assert.equal(
        (await request(owner, "learning/english/retry", correctBody)).status,
        404,
      );
      await Lesson.updateOne(
        { _id: lesson._id },
        { $set: { accessTier: "free", "quiz.0.question": "Updated question" } },
      );
      assert.equal(
        (await (await request(owner, "learning/english")).json()).items.length,
        0,
      );
      await Lesson.updateOne(
        { _id: lesson._id },
        { $set: { publicationStatus: "draft" } },
      );
      assert.equal(
        (await request(owner, "learning/english/retry", correctBody)).status,
        404,
      );
      assert.equal((await request(owner, "learning/paid_batch")).status, 400);
      assert.equal(await Quiz.countDocuments(), 1);
      const arabic = await Course.create({
        language: "arabic",
        title: "Arabic isolated fixture",
        status: "published",
      });
      await Lesson.create({
        language: "arabic",
        courseGeneration: arabic.generation,
        publicationStatus: "published",
        day: 1,
        title: "Arabic greeting fixture",
        quiz: [
          {
            question: "اختر التحية",
            options: ["مَرْحَبًا", "وَدَاعًا"],
            correctAnswer: 0,
          },
        ],
      });
      assert.equal(
        (
          await (
            await request(owner, "quiz/submit", {
              language: "arabic",
              day: 1,
              responses: [{ selectedAnswer: 0 }],
            })
          ).json()
        ).correctAnswers,
        1,
      );
      assert.equal(
        (await (await request(owner, "learning/arabic")).json()).items.length,
        0,
      );
      await User.updateOne(
        { _id: none._id },
        { $set: { role: "web_developer" } },
      );
      const removed = await fetch(
        `http://127.0.0.1:${server.address().port}/api/auth/users/${owner._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              "Bearer " +
              jwt.sign({ userId: String(none._id) }, config.JWT_SECRET, {
                expiresIn: "5m",
              }),
          },
        },
      );
      assert.equal(removed.status, 200);
      assert.equal(
        await ReviewAttempt.countDocuments({ userId: owner._id }),
        0,
      );
      assert.equal((await request(owner, "learning/english")).status, 401);
    } finally {
      if (server) await new Promise((r) => server.close(r));
      if (mongoose.connection.name === database)
        await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  },
);
