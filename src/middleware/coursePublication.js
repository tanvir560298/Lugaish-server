import { Lesson } from "../models/Lesson.js";
import { Course } from "../models/Course.js";
import { User } from "../models/User.js";
import { authMiddleware } from "./auth.js";
import { hasPermission, normalizeRole, ROLES } from "../utils/roles.js";

// Missing publication metadata is deliberately closed: old databases cannot
// silently republish the legacy catalog on upgrade.
export function coursePublication(req, res, next) {
  return authMiddleware(req, res, async () => {
    try {
      const user = await User.findById(req.userId).select("role");
      if (!user) return res.status(401).json({ error: "Account unavailable" });
      const staff =
        hasPermission(user.role, "manage_lessons") &&
        normalizeRole(user.role) !== ROLES.tester;
      if (
        normalizeRole(user.role) === ROLES.tester &&
        req.baseUrl.endsWith("/lessons")
      ) {
        req.publicationFilter = {};
        return next();
      }
      const preview = req.get("X-Lugaish-Learner-Preview") === "1";
      req.publicationFilter =
        staff && !preview ? {} : { publicationStatus: "published" };
      const language =
        req.path
          .split("/")
          .find((part) => ["english", "arabic", "paid_batch"].includes(part)) ||
        req.body?.language;
      if (!["english", "arabic", "paid_batch"].includes(language))
        return next();
      req.publishedCourse = await Course.findOne({
        language,
        status: "published",
      }).lean();
      req.courseGeneration = req.publishedCourse?.generation;
      if (staff && !preview) {
        const authoring = await Course.findOne({ language }).lean();
        req.authoringFilter = authoring
          ? { courseGeneration: authoring.generation }
          : {};
        req.publicationFilter = authoring
          ? req.authoringFilter
          : { publicationStatus: "archived" };
        if (req.method !== "GET" && !authoring)
          return res
            .status(409)
            .json({
              error: "Create a draft course before authoring new lessons.",
            });
        return next();
      }
      if (!req.publishedCourse)
        return res.status(404).json({
          error: "No published course is available yet.",
          code: "COURSE_UNAVAILABLE",
        });
      req.publicationFilter.courseGeneration = req.courseGeneration;
      if (
        req.publishedCourse.startAt &&
        new Date(req.publishedCourse.startAt) > new Date()
      ) {
        return res
          .status(403)
          .json({
            error: "This course has not started yet.",
            code: "COURSE_NOT_STARTED",
          });
      }
      const pieces = req.path.split("/");
      const day = Number(
        req.body?.day ??
          pieces[pieces.findIndex((part) => part === language) + 1],
      );
      if (
        Number.isInteger(day) &&
        day > 0 &&
        !(await Lesson.exists({
          language,
          day,
          publicationStatus: "published",
          courseGeneration: req.courseGeneration,
        }))
      )
        return res.status(404).json({
          error: "This lesson is not published.",
          code: "LESSON_UNAVAILABLE",
        });
      return next();
    } catch {
      return res.status(503).json({
        error: "Course availability could not be verified. Please retry.",
      });
    }
  });
}
