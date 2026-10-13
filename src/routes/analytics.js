import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Lesson } from "../models/Lesson.js";
import { Quiz } from "../models/Quiz.js";
import { Progress } from "../models/Progress.js";
import { ReviewAttempt } from "../models/ReviewAttempt.js";
import {
  getArabicCourseDay,
  getEnglishCourseDay,
} from "../utils/courseLaunch.js";
import { deriveLearnerDay } from "../services/courseProgression.js";
import {
  analyticsOptions,
  calculateAnalytics,
} from "../services/learningAnalytics.js";
const router = express.Router();
router.use(authMiddleware);
router.get("/instructor", (req, res) =>
  res.status(403).json({
    error:
      "Instructor analytics require an explicit instructor-to-course assignment. This view is not enabled.",
    code: "COURSE_SCOPE_REQUIRED",
  }),
);
router.get("/:language", async (req, res) => {
  try {
    let options;
    try {
      options = analyticsOptions(req.query);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const language = req.params.language;
    if (!["arabic", "english"].includes(language))
      return res
        .status(400)
        .json({ error: "Choose Arabic or English analytics." });
    const user = await User.findById(req.userId).select(
      "enrolledPathways isPremium",
    );
    if (!user) return res.status(401).json({ error: "Account unavailable." });
    if (!user.enrolledPathways.includes(language))
      return res.status(403).json({ error: "Not enrolled in this language." });
    const course = await Course.findOne({
      language,
      status: "published",
    }).lean();
    if (!course)
      return res.json({
        catalogAvailable: false,
        language,
        range: options.range,
        zone: options.zone,
        ...calculateAnalytics({ options }),
        nextAvailable: false,
      });
    const filter = {
      userId: req.userId,
      language,
      courseGeneration: course.generation,
    };
    const [quizzes, reviews, progress] = await Promise.all([
      Quiz.find(filter).sort({ completedAt: -1, _id: -1 }).limit(5001).lean(),
      ReviewAttempt.find(filter)
        .sort({ completedAt: -1, _id: -1 })
        .limit(5001)
        .lean(),
      Progress.find(filter).limit(11).select("completedDays").lean(),
    ]);
    const partial =
      quizzes.length > 5000 || reviews.length > 5000 || progress.length > 10;
    const completed = new Map();
    for (const p of progress.slice(0, 10))
      for (const c of p.completedDays || [])
        if (Number.isInteger(c.day)) completed.set(c.day, c.completedAt);
    for (const q of quizzes.slice(0, 5000))
      if (Number.isInteger(q.day) && !completed.has(q.day))
        completed.set(q.day, q.completedAt);
    const calendar =
      language === "arabic"
        ? getArabicCourseDay({
            role: "learner",
            activeCourseStartDate: course.startAt,
          })
        : getEnglishCourseDay({
            role: "learner",
            activeCourseStartDate: course.startAt,
          });
    let contiguous = 0;
    while (completed.has(contiguous + 1)) contiguous++;
    const current = deriveLearnerDay({
      completedDays: [...completed.keys()],
      lastCompletedAt: completed.get(contiguous),
      calendarDay: calendar,
    });
    const lessons = await Lesson.find({
      language,
      courseGeneration: course.generation,
      publicationStatus: "published",
      day: {
        $lte:
          partial || new Date(course.startAt) > new Date()
            ? 0
            : Math.min(calendar, current),
      },
      ...(user.isPremium ? {} : { accessTier: { $ne: "premium" } }),
    })
      .sort({ day: 1 })
      .limit(365)
      .select("day title quiz")
      .lean();
    res.json({
      catalogAvailable: true,
      courseTitle: course.title,
      language,
      range: options.range,
      zone: options.zone,
      ...calculateAnalytics({
        lessons,
        quizzes: quizzes.slice(0, 5000),
        reviews: reviews.slice(0, 5000),
        progress: progress.slice(0, 10),
        options,
        partial,
      }),
      nextAvailable: !partial && lessons.some((l) => l.day === current),
    });
  } catch {
    res
      .status(503)
      .json({ error: "Learning analytics could not be loaded. Please retry." });
  }
});
export default router;
