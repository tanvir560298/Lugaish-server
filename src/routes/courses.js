import { randomUUID } from "node:crypto";
import {
  validPublishedQuiz,
  cleanMaterials,
} from "../utils/publishedContent.js";
import express from "express";
import { Course } from "../models/Course.js";
import { Lesson } from "../models/Lesson.js";
import { User } from "../models/User.js";
import {
  authMiddleware,
  optionalAuthMiddleware,
  requirePermission,
} from "../middleware/auth.js";
import { normalizeRole, ROLES } from "../utils/roles.js";
import { objectBody } from "../middleware/requestShape.js";
const router = express.Router(),
  languages = ["english", "arabic", "paid_batch"];
router.use(objectBody);
const fail = (res) =>
  res.status(503).json({
    error: "Course catalog is temporarily unavailable. Please retry.",
  });
router.get("/", optionalAuthMiddleware, async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    const user = req.userId
      ? await User.findById(req.userId).select(
          "privateBatchAccess privateBatchExplicitlyRevoked enrolledPathways",
        )
      : null;
    const privateAccess =
      user &&
      !user.privateBatchExplicitlyRevoked &&
      (user.privateBatchAccess ||
        user.enrolledPathways?.includes("paid_batch"));
    res.json(
      await Course.find({
        status: "published",
        ...(privateAccess ? {} : { language: { $ne: "paid_batch" } }),
      })
        .select("language title description status generation startAt")
        .lean(),
    );
  } catch {
    fail(res);
  }
});
router.get(
  "/manage",
  authMiddleware,
  requirePermission("manage_lessons"),
  async (req, res) => {
    if (normalizeRole(req.userRole) === ROLES.tester)
      return res
        .status(403)
        .json({ error: "Tester accounts cannot manage the live catalog" });
    try {
      res.json(await Course.find().lean());
    } catch {
      fail(res);
    }
  },
);
router.put(
  "/manage/:language",
  authMiddleware,
  optionalAuthMiddleware,
  requirePermission("manage_lessons"),
  async (req, res) => {
    if (normalizeRole(req.userRole) === ROLES.tester)
      return res
        .status(403)
        .json({ error: "Tester accounts cannot publish live courses" });
    const { language } = req.params,
      { title, description = "", status = "draft" } = req.body;
    if (
      !languages.includes(language) ||
      typeof title !== "string" ||
      !title.trim() ||
      title.length > 160 ||
      typeof description !== "string" ||
      description.length > 2000 ||
      !["draft", "published", "archived"].includes(status)
    )
      return res.status(400).json({
        error:
          "Valid language, title, description and publication state are required",
      });
    try {
      const existing = await Course.findOne({ language });
      const generation =
        existing?.status === "archived" && status === "draft"
          ? randomUUID()
          : existing?.generation || randomUUID();
      if (
        status === "published" &&
        !(await Lesson.exists({
          language,
          publicationStatus: "published",
          modulePublished: true,
          day: 1,
          courseGeneration: generation,
        }))
      )
        return res.status(409).json({
          error: "Publish a reviewed lesson before publishing its course",
        });
      res.json(
        await Course.findOneAndUpdate(
          { language },
          { $set: { title: title.trim(), description, status, generation } },
          { new: true, upsert: true, runValidators: true },
        ),
      );
    } catch {
      fail(res);
    }
  },
);
router.put(
  "/manage/:language/lessons/:day/publication",
  authMiddleware,
  requirePermission("manage_lessons"),
  async (req, res) => {
    if (normalizeRole(req.userRole) === ROLES.tester)
      return res
        .status(403)
        .json({ error: "Tester accounts cannot publish live lessons" });
    const { language } = req.params,
      day = Number(req.params.day),
      status = req.body.status;
    if (
      !languages.includes(language) ||
      !Number.isInteger(day) ||
      day < 1 ||
      day > 365 ||
      !["draft", "published", "archived"].includes(status)
    )
      return res.status(400).json({ error: "Invalid publication request" });
    try {
      const authoring = await Course.findOne({ language });
      if (!authoring)
        return res.status(409).json({ error: "Create a draft course first" });
      const lesson = await Lesson.findOne({
        language,
        day,
        courseGeneration: authoring.generation,
      });
      if (!lesson)
        return res
          .status(404)
          .json({ error: "Create this lesson in the existing editor first" });
      if (
        status === "published" &&
        (!lesson.modulePublished ||
          (!lesson.videos.length &&
            !lesson.videoUrl &&
            !lesson.quiz.length &&
            !lesson.speakingQuestions.length &&
            !lesson.materials.length))
      )
        return res
          .status(409)
          .json({ error: "Add reviewed content and publish its module first" });
      if (status === "published" && !validPublishedQuiz(lesson.quiz))
        return res
          .status(409)
          .json({ error: "Correct invalid quiz content before publication" });
      const course = await Course.findOne({ language });
      if (!course)
        return res.status(409).json({ error: "Create a draft course first" });
      lesson.courseGeneration = course.generation;
      lesson.publicationStatus = status;
      await lesson.save();
      res.json({ language, day, status });
    } catch {
      fail(res);
    }
  },
);
router.put(
  "/manage/:language/lessons/:day/content",
  authMiddleware,
  requirePermission("manage_lessons"),
  async (req, res) => {
    if (normalizeRole(req.userRole) === ROLES.tester)
      return res.status(403).json({
        error: "Tester accounts cannot edit live publication content",
      });
    const { language } = req.params,
      day = Number(req.params.day),
      quiz = req.body.quiz,
      materials = cleanMaterials(req.body.materials || []);
    if (
      !languages.includes(language) ||
      !Number.isInteger(day) ||
      day < 1 ||
      day > 365 ||
      !validPublishedQuiz(quiz) ||
      materials === null
    )
      return res.status(400).json({
        error: "Valid reviewed quiz and HTTPS materials are required",
      });
    try {
      const authoring = await Course.findOne({ language });
      if (!authoring)
        return res.status(409).json({ error: "Create a draft course first" });
      const lesson = await Lesson.findOne({
        language,
        day,
        courseGeneration: authoring.generation,
      });
      if (!lesson)
        return res
          .status(404)
          .json({ error: "Create the lesson in the existing editor first" });
      lesson.quiz = quiz.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || "",
      }));
      lesson.materials = materials;
      lesson.publicationStatus = "draft";
      await lesson.save();
      res.json({ language, day, status: "draft" });
    } catch {
      fail(res);
    }
  },
);
router.get("/:language", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findOne({
      language: req.params.language,
      status: "published",
    }).lean();
    if (!course)
      return res.status(404).json({
        error: "No published course is available yet.",
        code: "COURSE_UNAVAILABLE",
      });
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ error: "Account unavailable" });
    if (
      course.language === "paid_batch" &&
      (user.privateBatchExplicitlyRevoked ||
        !(
          user.privateBatchAccess ||
          user.enrolledPathways?.includes("paid_batch")
        ))
    )
      return res
        .status(403)
        .json({ error: "Private Batch enrollment required" });
    const lessons = await Lesson.find({
      language: course.language,
      publicationStatus: "published",
      courseGeneration: course.generation,
    })
      .select("day title description duration")
      .lean();
    res.json({ ...course, lessons, totalDays: lessons.length });
  } catch {
    fail(res);
  }
});
export default router;
