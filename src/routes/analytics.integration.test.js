import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";
import routes from "./analytics.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Lesson } from "../models/Lesson.js";
import { Quiz } from "../models/Quiz.js";
import { ReviewAttempt } from "../models/ReviewAttempt.js";
import { quizContentKey } from "../services/personalizedLearning.js";
import config from "../config.js";
test(
  "analytics owner, enrollment, publication, dates and instructor boundaries",
  { skip: process.env.RUN_QUIZ_INTEGRATION !== "1" },
  async () => {
    const database = `lugaish_analytics_test_${process.pid}_${Date.now()}`;
    let server;
    await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`);
    try {
      const app = express();
      app.use("/api/analytics", routes);
      server = app.listen(0, "127.0.0.1");
      await new Promise((r) => server.once("listening", r));
      const [owner, other, none, teacher] = await User.create([
        {
          name: "Owner",
          email: "owner@analytics.invalid",
          enrolledPathways: ["english"],
        },
        {
          name: "Other",
          email: "other@analytics.invalid",
          enrolledPathways: ["english"],
        },
        { name: "None", email: "none@analytics.invalid", enrolledPathways: [] },
        {
          name: "Teacher",
          email: "teacher@analytics.invalid",
          role: "instructor",
          enrolledPathways: [],
        },
      ]);
      const request = (u, path = "english?range=all") =>
        fetch(
          `http://127.0.0.1:${server.address().port}/api/analytics/${path}`,
          {
            headers: u
              ? {
                  Authorization:
                    "Bearer " +
                    jwt.sign({ userId: String(u._id) }, config.JWT_SECRET, {
                      expiresIn: "5m",
                    }),
                }
              : {},
          },
        );
      assert.equal((await request(null)).status, 401);
      assert.equal((await request(none)).status, 403);
      assert.equal((await request(teacher, "instructor")).status, 403);
      assert.equal((await request(owner, "english?zone=Invalid")).status, 400);
      assert.equal((await request(owner, "english?page=900")).status, 400);
      assert.equal(
        (await (await request(owner)).json()).catalogAvailable,
        false,
      );
      const c = await Course.create({
          language: "english",
          title: "Isolated analytics fixture",
          status: "published",
        }),
        l = await Lesson.create({
          language: "english",
          courseGeneration: c.generation,
          publicationStatus: "published",
          day: 1,
          title: "Fixture",
          quiz: [{ question: "A?", options: ["A", "B"], correctAnswer: 0 }],
        });
      const q = await Quiz.create({
        userId: owner._id,
        language: "english",
        day: 1,
        courseGeneration: c.generation,
        contentKey: quizContentKey(l.quiz),
        responses: [{ questionIndex: 0, selectedAnswer: 1, isCorrect: false }],
        score: 0,
        totalQuestions: 1,
      });
      await ReviewAttempt.create({
        userId: owner._id,
        sourceQuiz: q._id,
        language: "english",
        courseGeneration: c.generation,
        questionIndex: 0,
        selectedAnswer: 0,
        isCorrect: true,
        requestId: "analytics-retry",
      });
      let data = await (await request(owner)).json();
      assert.equal(data.metrics.practiceSessions, 1);
      assert.equal(data.review.successful, 1);
      assert.equal(data.activity.items.length, 2);
      assert.equal(JSON.stringify(data).includes(owner.email), false);
      assert.equal(JSON.stringify(data).includes("selectedAnswer"), false);
      assert.equal(
        (await (await request(other)).json()).metrics.practiceSessions,
        0,
      );
      await Course.updateOne({_id:c._id},{$set:{startAt:new Date(Date.now()+86400000)}});
    assert.equal((await(await request(owner)).json()).nextAvailable,false);
    assert.equal((await(await request(owner)).json()).metrics.practiceSessions,0);
    await Course.updateOne({_id:c._id},{$set:{startAt:new Date()}});
    await Lesson.updateOne(
        { _id: l._id },
        { $set: { accessTier: "premium" } },
      );
      assert.equal(
        (await (await request(owner)).json()).metrics.practiceSessions,
        0,
      );
      await Lesson.updateOne(
        { _id: l._id },
        { $set: { accessTier: "free", publicationStatus: "archived" } },
      );
      assert.equal(
        (await (await request(owner)).json()).activity.items.length,
        0,
      );
      await Course.updateOne({ _id: c._id }, { $set: { status: "archived" } });
      assert.equal(
        (await (await request(owner)).json()).catalogAvailable,
        false,
      );
    } finally {
      if (server) await new Promise((r) => server.close(r));
      if (mongoose.connection.name === database)
        await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  },
);
