import test from "node:test";
import assert from "node:assert/strict";
import {
  getStudentProfile,
  getVerifiedProgress,
  createStudyPlan,
  updateStudyPlan,
  generatePracticeQuiz,
  getMistakeHistory,
  recommendNextActivity,
} from "./agentTools.js";
import { User } from "../models/User.js";
import { NovyraProfile } from "../models/NovyraProfile.js";
import { Progress } from "../models/Progress.js";
import { Quiz } from "../models/Quiz.js";
import { ReviewAttempt } from "../models/ReviewAttempt.js";
import { NovyraStudyPlan } from "../models/NovyraStudyPlan.js";

test("getStudentProfile returns sanitized profile with default Novyra values", async () => {
  // Stub User.findById and NovyraProfile.findOne
  const origUserFindById = User.findById;
  const origProfileFindOne = NovyraProfile.findOne;

  try {
    User.findById = () => ({
      select: () => ({
        lean: async () => ({
          name: "Test Student",
          email: "student@lugaish.test",
          role: "student",
          totalXP: 350,
          streak: 5,
          enrolledPathways: ["english", "java"],
        }),
      }),
    });

    NovyraProfile.findOne = () => ({
      lean: async () => ({
        targetSubject: "java",
        experienceLevel: "intermediate",
        primaryGoal: "exam_preparation",
        dailyTimeMinutes: 45,
        explanationLanguage: "english",
        onboardingCompleted: true,
        weakAreas: ["Loops", "Arrays"],
        masteredTopics: ["Variables"],
      }),
    });

    const profile = await getStudentProfile("student-123");
    assert.equal(profile.studentName, "Test Student");
    assert.equal(profile.targetSubject, "java");
    assert.equal(profile.experienceLevel, "intermediate");
    assert.equal(profile.dailyTimeMinutes, 45);
    assert.equal(profile.onboardingCompleted, true);
    assert.deepEqual(profile.weakAreas, ["Loops", "Arrays"]);
  } finally {
    User.findById = origUserFindById;
    NovyraProfile.findOne = origProfileFindOne;
  }
});

test("getVerifiedProgress returns genuine progress records and mistake counts", async () => {
  const origProgressFind = Progress.find;
  const origQuizFind = Quiz.find;
  const origReviewFind = ReviewAttempt.find;

  try {
    Progress.find = () => ({
      lean: async () => [
        {
          language: "english",
          currentDay: 4,
          completedDays: [1, 2, 3],
          totalXP: 180,
          streak: 3,
          weakAreas: ["Adjectives"],
        },
      ],
    });

    Quiz.find = () => ({
      sort: () => ({
        limit: () => ({
          lean: async () => [
            { language: "english", day: 3, score: 8, totalQuestions: 10, completedAt: new Date() },
          ],
        }),
      }),
    });

    ReviewAttempt.find = () => ({
      sort: () => ({
        limit: () => ({
          lean: async () => [
            { isCorrect: false },
            { isCorrect: false },
            { isCorrect: true },
          ],
        }),
      }),
    });

    const result = await getVerifiedProgress("student-123");
    assert.equal(result.pathways.length, 1);
    assert.equal(result.pathways[0].language, "english");
    assert.equal(result.pathways[0].completedDaysCount, 3);
    assert.equal(result.recentQuizResults.length, 1);
    assert.equal(result.pendingMistakesCount, 2);
  } finally {
    Progress.find = origProgressFind;
    Quiz.find = origQuizFind;
    ReviewAttempt.find = origReviewFind;
  }
});

test("createStudyPlan validates subject and generates structured plan with blocks", async () => {
  const origPlanCreate = NovyraStudyPlan.create;

  try {
    let createdPayload = null;
    NovyraStudyPlan.create = async (doc) => {
      createdPayload = doc;
      return { _id: "plan-mock-1", ...doc };
    };

    const plan = await createStudyPlan("student-123", {
      subject: "java",
      topic: "Loop control structures",
      durationMinutes: 45,
    });

    assert.ok(plan);
    assert.equal(createdPayload.userId, "student-123");
    assert.equal(createdPayload.subject, "java");
    assert.equal(createdPayload.targetDurationMinutes, 45);
    assert.ok(Array.isArray(createdPayload.blocks));
    assert.ok(createdPayload.blocks.length >= 3);
    // Verify block structure
    assert.ok(createdPayload.blocks[0].title);
    assert.ok(createdPayload.blocks[0].durationMinutes > 0);
  } finally {
    NovyraStudyPlan.create = origPlanCreate;
  }
});

test("createStudyPlan rejects invalid subject", async () => {
  await assert.rejects(
    async () => {
      await createStudyPlan("student-123", {
        subject: "invalid_alien_language",
        topic: "Loops",
      });
    },
    { message: /Subject must be one of/ }
  );
});

test("updateStudyPlan updates status and marks completed blocks", async () => {
  const origFindOne = NovyraStudyPlan.findOne;
  const origProfileUpdate = NovyraProfile.findOneAndUpdate;

  try {
    const mockPlan = {
      _id: "plan-mock-1",
      userId: "student-123",
      status: "active",
      currentBlockIndex: 0,
      actualDurationMinutes: 0,
      blocks: [
        { id: "b-1", title: "Concepts", durationMinutes: 15, completed: false },
        { id: "b-2", title: "Practice", durationMinutes: 20, completed: false },
      ],
      save: async function () {
        return this;
      },
    };

    NovyraStudyPlan.findOne = async () => mockPlan;
    NovyraProfile.findOneAndUpdate = async () => ({});

    // Mark first block complete
    const updated = await updateStudyPlan("student-123", "plan-mock-1", {
      completedBlockIndex: 0,
      studentNotes: "Mastered for loops",
    });

    assert.equal(updated.blocks[0].completed, true);
    assert.equal(updated.blocks[0].studentNotes, "Mastered for loops");
    assert.equal(updated.currentBlockIndex, 1);
    assert.equal(updated.actualDurationMinutes, 15);
  } finally {
    NovyraStudyPlan.findOne = origFindOne;
    NovyraProfile.findOneAndUpdate = origProfileUpdate;
  }
});

test("generatePracticeQuiz returns structured questions with explanations", async () => {
  const quiz = await generatePracticeQuiz("student-123", "python", "Lists and Tuples");
  assert.equal(quiz.subject, "python");
  assert.ok(Array.isArray(quiz.questions));
  assert.ok(quiz.questions.length > 0);
  assert.ok(quiz.questions[0].question);
  assert.ok(quiz.questions[0].options.length >= 2);
  assert.ok(typeof quiz.questions[0].correctIndex === "number");
  assert.ok(quiz.questions[0].explanation);
});

test("recommendNextActivity recommends lesson if no progress, or targeting weak areas", async () => {
  const origProfileFind = NovyraProfile.findOne;
  const origProgressFind = Progress.findOne;

  try {
    // Case 1: No progress at all
    NovyraProfile.findOne = () => ({ lean: async () => null });
    Progress.findOne = () => ({ lean: async () => null });

    const rec1 = await recommendNextActivity("student-1", "english");
    assert.ok(rec1.recommendation.includes("Day 1"));

    // Case 2: Has progress and weak area
    NovyraProfile.findOne = () => ({
      lean: async () => ({ weakAreas: ["Pointers", "Recursion"] }),
    });
    Progress.findOne = () => ({
      lean: async () => ({ currentDay: 5 }),
    });

    const rec2 = await recommendNextActivity("student-1", "c");
    assert.ok(rec2.recommendation.includes("Pointers"));
    assert.equal(rec2.type, "novyra_practice");
  } finally {
    NovyraProfile.findOne = origProfileFind;
    Progress.findOne = origProgressFind;
  }
});
