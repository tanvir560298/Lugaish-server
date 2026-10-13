import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import config from "../config.js";
import courses from "./courses.js";
import lessons from "./lessons.js";
import auth from "./auth.js";
import { Course } from "../models/Course.js";
import { Lesson } from "../models/Lesson.js";
import { User } from "../models/User.js";

test(
  "Phase 20 authoring APIs publish a fresh course while archive, enrollment and independent history remain protected",
  { skip: process.env.RUN_CATALOG_INTEGRATION !== "1" },
  async () => {
    const database = `lugaish_phase20_catalog_${process.pid}_${Date.now()}`;
    let server;
    await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`);
    try {
      await Lesson.init();
      const [manager, student] = await User.create([
        {
          name: "Isolated course manager",
          email: "manager@phase20.invalid",
          role: "instructor",
          enrolledPathways: [],
        },
        {
          name: "Isolated student",
          email: "student@phase20.invalid",
          enrolledPathways: [],
          avatarUrl: "/avatars/zain-quaternius.png",
        },
      ]);
      const history = await Lesson.create({
        language: "english",
        day: 1,
        title: "Historical lesson",
        courseGeneration: "retired-generation",
        publicationStatus: "archived",
      });
      const independent = {};
      for (const collection of [
        "progresses",
        "studynotes",
        "studypreferences",
        "studyrooms",
        "reviewattempts",
        "quizzes",
      ]) {
        const record = {
          userId: student._id,
          fixture: "preserved historical record",
          generation: "retired-generation",
        };
        const result = await mongoose.connection.db
          .collection(collection)
          .insertOne(record);
        independent[collection] = await mongoose.connection.db
          .collection(collection)
          .findOne({ _id: result.insertedId });
      }
      const originalStudent = await User.findById(student._id).lean();
      const app = express();
      app.use(express.json());
      app.use("/api/courses", courses);
      app.use("/api/lessons", lessons);
      app.use("/api/auth", auth);
      server = app.listen(0, "127.0.0.1");
      await new Promise((resolve) => server.once("listening", resolve));
      const request = (
        path,
        user,
        body,
        method = body === undefined ? "GET" : "PUT",
      ) =>
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
          ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        });
      assert.deepEqual(await (await request("courses")).json(), []);
      assert.equal((await request("courses/english", student)).status, 404);
      assert.equal(
        (await request("courses/manage/english", manager, [])).status,
        400,
      );
      const draft = {
        title: "Reviewed fresh course",
        description: "Isolated curriculum",
        status: "draft",
      };
      assert.equal(
        (await request("courses/manage/english", student, draft)).status,
        403,
      );
      assert.equal(
        (await request("courses/manage/english", manager, draft)).status,
        200,
      );
      assert.equal(
        (
          await request("lessons/english/1/module", manager, {
            moduleType: "video",
            title: "Fresh first lesson",
            description: "Reviewed lesson",
            published: true,
          })
        ).status,
        200,
      );
      assert.equal(
        (
          await request("courses/manage/english/lessons/1/content", manager, {
            quiz: [
              {
                question: "Choose a greeting",
                options: ["Hello", "Goodbye"],
                correctAnswer: 0,
              },
            ],
            materials: [
              {
                id: "reading",
                title: "Authorized test reference",
                url: "https://example.invalid/reading.pdf",
                type: "PDF",
              },
            ],
          })
        ).status,
        200,
      );
      assert.equal(
        (
          await request(
            "courses/manage/english/lessons/1/publication",
            manager,
            { status: "published" },
          )
        ).status,
        200,
      );
      assert.equal(
        (
          await request("courses/manage/english", manager, {
            ...draft,
            status: "published",
          })
        ).status,
        200,
      );
      const published = await request("courses");
      assert.equal(published.headers.get("cache-control"), "no-store");
      const catalog = await published.json();
      assert.equal(catalog.length, 1);
      assert.equal(catalog[0].title, draft.title);
      assert.equal((await request("lessons/english/1", student)).status, 403);
      assert.equal(
        (
          await request("courses/manage/english", manager, {
            ...draft,
            title: "Edited new course",
            status: "draft",
          })
        ).status,
        200,
      );
      assert.deepEqual(await (await request("courses")).json(), []);
      assert.equal((await request("courses/english", student)).status, 404);
      assert.equal(
        (
          await request("courses/manage/english", manager, {
            ...draft,
            status: "archived",
          })
        ).status,
        200,
      );
      assert.equal(
        (await request("auth/enroll", student, { language: "english" }, "POST"))
          .status,
        404,
      );
      assert.equal(
        (await Lesson.findById(history._id)).title,
        "Historical lesson",
      );
      assert.deepEqual(
        await User.findById(student._id).lean(),
        originalStudent,
      );
      for (const [collection, original] of Object.entries(independent))
        assert.deepEqual(
          await mongoose.connection.db
            .collection(collection)
            .findOne({ _id: original._id }),
          original,
        );
      assert.equal(await Course.countDocuments({ status: "published" }), 0);
    } finally {
      if (server) await new Promise((resolve) => server.close(resolve));
      if (mongoose.connection.name === database)
        await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  },
);
