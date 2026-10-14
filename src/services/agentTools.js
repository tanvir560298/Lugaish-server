import { User } from "../models/User.js";
import { Progress } from "../models/Progress.js";
import { Quiz } from "../models/Quiz.js";
import { ReviewAttempt } from "../models/ReviewAttempt.js";
import { NovyraProfile, NOVYRA_SUBJECTS } from "../models/NovyraProfile.js";
import { NovyraStudyPlan } from "../models/NovyraStudyPlan.js";
import { generateAiCompletion } from "./aiProvider.js";

// Tool: Get Student Profile & Novyra Memory
export async function getStudentProfile(userId) {
  const [user, profile] = await Promise.all([
    User.findById(userId)
      .select("name email role totalXP streak enrolledPathways currentDay isPremium")
      .lean(),
    NovyraProfile.findOne({ userId }).lean(),
  ]);

  if (!user) throw new Error("Student account not found");

  return {
    studentName: user.name,
    email: user.email,
    role: user.role,
    totalXP: user.totalXP || 0,
    streak: user.streak || 0,
    enrolledPathways: user.enrolledPathways || [],
    targetSubject: profile?.targetSubject || "english",
    experienceLevel: profile?.experienceLevel || "beginner",
    primaryGoal: profile?.primaryGoal || "general_mastery",
    dailyTimeMinutes: profile?.dailyTimeMinutes || 60,
    explanationLanguage: profile?.explanationLanguage || "english",
    onboardingCompleted: profile?.onboardingCompleted || false,
    weakAreas: profile?.weakAreas || [],
    masteredTopics: profile?.masteredTopics || [],
  };
}

// Tool: Get Verified Learning Progress (From real database records, never invented)
export async function getVerifiedProgress(userId) {
  const [progressDocs, recentQuizzes, reviewAttempts] = await Promise.all([
    Progress.find({ userId }).lean(),
    Quiz.find({ userId }).sort({ createdAt: -1 }).limit(10).lean(),
    ReviewAttempt.find({ userId }).sort({ createdAt: -1 }).limit(20).lean(),
  ]);

  const pathwaysSummary = progressDocs.map((p) => ({
    language: p.language,
    currentDay: p.currentDay,
    completedDaysCount: p.completedDays?.length || 0,
    totalXP: p.totalXP || 0,
    streak: p.streak || 0,
    weakAreas: p.weakAreas || [],
  }));

  const quizScores = recentQuizzes.map((q) => ({
    language: q.language,
    day: q.day,
    score: q.score,
    totalQuestions: q.totalQuestions,
    completedAt: q.completedAt,
  }));

  const mistakesToReview = reviewAttempts.filter((r) => !r.isCorrect).length;

  return {
    pathways: pathwaysSummary,
    recentQuizResults: quizScores,
    pendingMistakesCount: mistakesToReview,
  };
}

// Tool: Create Structured Daily Study Plan
export async function createStudyPlan(userId, { subject = "english", topic = "General Study", durationMinutes = 60 }) {
  if (!NOVYRA_SUBJECTS.includes(subject) && subject !== "general") {
    throw new Error(`Subject must be one of: ${NOVYRA_SUBJECTS.join(", ")}`);
  }

  const duration = Math.max(15, Math.min(360, Number(durationMinutes) || 60));

  // Request structured plan from AI provider
  const completion = await generateAiCompletion({
    userId,
    messages: [
      {
        sender: "student",
        content: `Create a structured ${duration}-minute study plan for ${subject} focusing on ${topic}. Include timed blocks for concepts, practice, break, quiz, and reflection.`,
      },
    ],
    systemPrompt:
      "You are the Novyra Study Planner. Output a strict JSON object with: title, subject, topic, targetDurationMinutes, blocks (array of { id, title, type, durationMinutes, objectives, instructions, materials }), recommendedNextActivity.",
    jsonMode: true,
  });

  let parsed;
  try {
    parsed = JSON.parse(completion.text);
  } catch {
    throw new Error("Failed to parse generated study plan structure");
  }

  // Validate and sanitize blocks
  const validTypes = ["concept", "practice", "quiz", "break", "reflection", "coding_exercise"];
  const sanitizedBlocks = (parsed.blocks || []).map((b, idx) => ({
    id: b.id || `block-${idx + 1}`,
    title: String(b.title || `Study Block ${idx + 1}`),
    type: validTypes.includes(b.type) ? b.type : "concept",
    durationMinutes: Math.max(1, Number(b.durationMinutes) || 10),
    objectives: Array.isArray(b.objectives) ? b.objectives.map(String) : [],
    instructions: String(b.instructions || ""),
    materials: Array.isArray(b.materials) ? b.materials.map(String) : [],
    completed: false,
  }));

  if (sanitizedBlocks.length === 0) {
    sanitizedBlocks.push({
      id: "block-1",
      title: `${topic} - Core Concepts`,
      type: "concept",
      durationMinutes: duration,
      objectives: [`Study and master ${topic}`],
      instructions: "Work through the topic material carefully.",
      materials: [],
      completed: false,
    });
  }

  // Create new active plan in MongoDB
  const plan = await NovyraStudyPlan.create({
    userId,
    subject,
    topic,
    title: parsed.title || `${subject.toUpperCase()}: ${topic}`,
    targetDurationMinutes: duration,
    status: "active",
    blocks: sanitizedBlocks,
    currentBlockIndex: 0,
    startedAt: new Date(),
    recommendedNextActivity: parsed.recommendedNextActivity || "Complete study blocks to progress",
  });

  return plan;
}

// Tool: Update Study Plan Status / Mark Block Completed
export async function updateStudyPlan(userId, planId, updates = {}) {
  const plan = await NovyraStudyPlan.findOne({ _id: planId, userId });
  if (!plan) throw new Error("Study plan not found or unauthorized");

  if (updates.status && ["active", "paused", "completed", "abandoned"].includes(updates.status)) {
    plan.status = updates.status;
    if (updates.status === "completed") {
      plan.completedAt = new Date();
    }
  }

  if (typeof updates.currentBlockIndex === "number" && updates.currentBlockIndex >= 0 && updates.currentBlockIndex < plan.blocks.length) {
    plan.currentBlockIndex = updates.currentBlockIndex;
  }

  if (typeof updates.completedBlockIndex === "number") {
    const idx = updates.completedBlockIndex;
    if (idx >= 0 && idx < plan.blocks.length) {
      plan.blocks[idx].completed = true;
      plan.blocks[idx].completedAt = new Date();
      if (updates.studentNotes) {
        plan.blocks[idx].studentNotes = updates.studentNotes;
      }
      // Calculate actual duration
      plan.actualDurationMinutes = plan.blocks
        .filter((b) => b.completed)
        .reduce((sum, b) => sum + b.durationMinutes, 0);

      // Auto-advance block index if appropriate
      if (plan.currentBlockIndex === idx && idx + 1 < plan.blocks.length) {
        plan.currentBlockIndex = idx + 1;
      }

      // Check if all blocks completed
      if (plan.blocks.every((b) => b.completed)) {
        plan.status = "completed";
        plan.completedAt = new Date();

        // Increment student's completed sessions in NovyraProfile
        await NovyraProfile.findOneAndUpdate(
          { userId },
          {
            $inc: {
              completedSessionsCount: 1,
              totalStudyMinutes: plan.actualDurationMinutes,
            },
            $set: { lastActiveDate: new Date() },
          }
        );
      }
    }
  }

  if (updates.studentReflection) {
    plan.studentReflection = updates.studentReflection;
  }
  if (updates.confidenceRating >= 1 && updates.confidenceRating <= 5) {
    plan.confidenceRating = updates.confidenceRating;
  }

  await plan.save();
  return plan;
}

// Tool: Generate Practice Quiz
export async function generatePracticeQuiz(userId, subject = "english", topic = "Fundamentals") {
  const completion = await generateAiCompletion({
    userId,
    messages: [
      {
        sender: "student",
        content: `Generate a 3-question multiple choice practice quiz for ${subject} on the topic of ${topic}.`,
      },
    ],
    systemPrompt:
      "You are Novyra Quiz Generator. Output a strict JSON object with: subject, topic, questions (array of { question, options, correctIndex, explanation }).",
    jsonMode: true,
  });

  let parsed;
  try {
    parsed = JSON.parse(completion.text);
  } catch {
    throw new Error("Failed to parse practice quiz structure");
  }

  return {
    subject: parsed.subject || subject,
    topic: parsed.topic || topic,
    questions: (parsed.questions || []).map((q, idx) => ({
      id: `q-${idx + 1}`,
      question: String(q.question),
      options: Array.isArray(q.options) ? q.options.map(String) : [],
      correctIndex: Number(q.correctIndex) || 0,
      explanation: String(q.explanation || ""),
    })),
  };
}

// Tool: Get Mistake History for Subject
export async function getMistakeHistory(userId, subject = "english") {
  const reviewAttempts = await ReviewAttempt.find({ userId, language: subject, isCorrect: false })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return {
    subject,
    mistakesCount: reviewAttempts.length,
    recentMistakes: reviewAttempts.map((m) => ({
      questionIndex: m.questionIndex,
      selectedAnswer: m.selectedAnswer,
      completedAt: m.completedAt,
    })),
  };
}

// Tool: Recommend Next Activity based on genuine student history
export async function recommendNextActivity(userId, subject = "english") {
  const [profile, progress] = await Promise.all([
    NovyraProfile.findOne({ userId }).lean(),
    Progress.findOne({ userId, language: subject }).lean(),
  ]);

  if (!progress) {
    return {
      recommendation: `Start Day 1 in ${subject.toUpperCase()} to establish your baseline streak.`,
      actionUrl: `/daily-lessons`,
      type: "lesson",
    };
  }

  if (profile?.weakAreas?.length > 0) {
    return {
      recommendation: `Target your weak area in ${profile.weakAreas[0]} with a 30-minute practice session.`,
      actionUrl: `/novyra?action=practice&topic=${encodeURIComponent(profile.weakAreas[0])}`,
      type: "novyra_practice",
    };
  }

  return {
    recommendation: `Continue to Day ${progress.currentDay} in your ${subject.toUpperCase()} pathway.`,
    actionUrl: `/daily-lessons`,
    type: "lesson",
  };
}
