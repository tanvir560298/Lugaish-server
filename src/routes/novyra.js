import express from "express";
import { randomUUID } from "node:crypto";
import { authMiddleware } from "../middleware/auth.js";
import { objectBody } from "../middleware/requestShape.js";
import { NovyraProfile, NOVYRA_SUBJECTS, NOVYRA_LEVELS, NOVYRA_GOALS, NOVYRA_LANGUAGES } from "../models/NovyraProfile.js";
import { NovyraStudyPlan } from "../models/NovyraStudyPlan.js";
import { NovyraConversation } from "../models/NovyraConversation.js";
import { NovyraUsage } from "../models/NovyraUsage.js";
import { generateAiCompletion, checkUserQuota, getTodayKey } from "../services/aiProvider.js";
import {
  getStudentProfile,
  getVerifiedProgress,
  createStudyPlan,
  updateStudyPlan,
  generatePracticeQuiz,
  getMistakeHistory,
  recommendNextActivity,
} from "../services/agentTools.js";

const router = express.Router();
router.use(authMiddleware);

// --------------------------------------------------------------------------
// 1. STUDENT ONBOARDING & PROFILE MEMORY
// --------------------------------------------------------------------------

router.get("/profile", async (req, res) => {
  try {
    let profile = await NovyraProfile.findOne({ userId: req.userId });
    if (!profile) {
      profile = await NovyraProfile.create({
        userId: req.userId,
        targetSubject: "english",
        experienceLevel: "beginner",
        primaryGoal: "general_mastery",
        dailyTimeMinutes: 60,
        explanationLanguage: "english",
        onboardingCompleted: false,
      });
    }

    const fullProfile = await getStudentProfile(req.userId);
    res.json({ profile, fullProfile });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve Novyra profile" });
  }
});

router.put("/profile", objectBody, async (req, res) => {
  try {
    const {
      targetSubject,
      experienceLevel,
      primaryGoal,
      dailyTimeMinutes,
      explanationLanguage,
      learningPreferences,
      onboardingCompleted,
      weakAreas,
      masteredTopics,
    } = req.body;

    const updates = { lastActiveDate: new Date() };

    if (targetSubject && NOVYRA_SUBJECTS.includes(targetSubject)) {
      updates.targetSubject = targetSubject;
    }
    if (experienceLevel && NOVYRA_LEVELS.includes(experienceLevel)) {
      updates.experienceLevel = experienceLevel;
    }
    if (primaryGoal && NOVYRA_GOALS.includes(primaryGoal)) {
      updates.primaryGoal = primaryGoal;
    }
    if (typeof dailyTimeMinutes === "number" && dailyTimeMinutes >= 15 && dailyTimeMinutes <= 360) {
      updates.dailyTimeMinutes = dailyTimeMinutes;
    }
    if (explanationLanguage && NOVYRA_LANGUAGES.includes(explanationLanguage)) {
      updates.explanationLanguage = explanationLanguage;
    }
    if (learningPreferences && typeof learningPreferences === "object") {
      updates.learningPreferences = learningPreferences;
    }
    if (typeof onboardingCompleted === "boolean") {
      updates.onboardingCompleted = onboardingCompleted;
    }
    if (Array.isArray(weakAreas)) {
      updates.weakAreas = weakAreas.slice(0, 50).map(String);
    }
    if (Array.isArray(masteredTopics)) {
      updates.masteredTopics = masteredTopics.slice(0, 50).map(String);
    }

    const profile = await NovyraProfile.findOneAndUpdate(
      { userId: req.userId },
      { $set: updates },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to update Novyra profile" });
  }
});

// --------------------------------------------------------------------------
// 2. CONVERSATIONAL TUTOR & TOOL-CALLING CHAT
// --------------------------------------------------------------------------

router.post("/chat", objectBody, async (req, res) => {
  try {
    const {
      sessionId = "default",
      contextType = "general",
      subject = "general",
      message,
    } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message content is required" });
    }

    // Check quota
    const quota = await checkUserQuota(req.userId);
    if (!quota.allowed) {
      return res.status(429).json({ error: quota.reason });
    }

    // Load or create conversation session
    let conversation = await NovyraConversation.findOne({
      userId: req.userId,
      sessionId,
    });

    if (!conversation) {
      conversation = new NovyraConversation({
        userId: req.userId,
        sessionId,
        contextType,
        subject,
        messages: [],
      });
    }

    // Add student message
    const studentMsg = {
      id: randomUUID(),
      sender: "student",
      content: message.trim(),
      timestamp: new Date(),
    };
    conversation.messages.push(studentMsg);

    // Keep bounded history (last 16 messages for context)
    const contextMessages = conversation.messages.slice(-16);

    // Check for agent tool execution triggers
    const lower = message.toLowerCase();
    const executedTools = [];

    if (lower.includes("my progress") || lower.includes("how am i doing")) {
      const progressData = await getVerifiedProgress(req.userId);
      executedTools.push({ name: "getVerifiedProgress", result: progressData });
    } else if (lower.includes("weak area") || lower.includes("my mistakes")) {
      const mistakeData = await getMistakeHistory(req.userId, subject);
      executedTools.push({ name: "getMistakeHistory", result: mistakeData });
    } else if (lower.includes("what next") || lower.includes("recommend")) {
      const rec = await recommendNextActivity(req.userId, subject);
      executedTools.push({ name: "recommendNextActivity", result: rec });
    }

    // System prompt with pedagogical instructions
    const systemPrompt =
      "You are NOVYRA, the intelligent, personalized learning companion on Lugaish. " +
      "You teach concepts step by step, adjust depth to the student's ability, provide code examples with proper formatting, " +
      "use hints before complete solutions, and guide students to mastery. " +
      "Subjects supported: English, Arabic, C, Java, Python, JavaScript, Web Development, Computer Science. " +
      "Zain is the 3D student avatar on campus; you are the intelligent mentor. " +
      (executedTools.length > 0 ? `\nContext data from platform tools: ${JSON.stringify(executedTools)}` : "");

    // Generate AI response
    const completion = await generateAiCompletion({
      userId: req.userId,
      messages: contextMessages,
      systemPrompt,
    });

    // Determine avatar state
    let avatarState = "responding";
    if (completion.text.includes("💡") || completion.text.includes("hint")) {
      avatarState = "thinking";
    } else if (completion.text.includes("Great job") || completion.text.includes("Awesome") || completion.text.includes("streak")) {
      avatarState = "encouraging";
    }

    const novyraMsg = {
      id: randomUUID(),
      sender: "novyra",
      content: completion.text,
      toolCalls: executedTools,
      avatarState,
      timestamp: new Date(),
      tokenCount: completion.completionTokens,
    };
    conversation.messages.push(novyraMsg);
    conversation.lastActivity = new Date();
    await conversation.save();

    res.json({
      message: novyraMsg,
      provider: completion.provider,
      model: completion.model,
      avatarState,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to process message" });
  }
});

router.get("/chat/history", async (req, res) => {
  try {
    const sessionId = req.query.sessionId || "default";
    const conversation = await NovyraConversation.findOne({
      userId: req.userId,
      sessionId,
    }).lean();

    res.json(conversation?.messages || []);
  } catch {
    res.status(500).json({ error: "Failed to retrieve conversation history" });
  }
});

// --------------------------------------------------------------------------
// 3. INTELLIGENT STUDY PLANNER
// --------------------------------------------------------------------------

router.get("/plans/active", async (req, res) => {
  try {
    const plan = await NovyraStudyPlan.findOne({
      userId: req.userId,
      status: { $in: ["active", "paused"] },
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(plan || null);
  } catch {
    res.status(500).json({ error: "Failed to fetch active study plan" });
  }
});

router.get("/plans", async (req, res) => {
  try {
    const plans = await NovyraStudyPlan.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json(plans);
  } catch {
    res.status(500).json({ error: "Failed to fetch study plans" });
  }
});

router.post("/plans", objectBody, async (req, res) => {
  try {
    const { subject = "english", topic = "Fundamentals", durationMinutes = 60 } = req.body;
    const plan = await createStudyPlan(req.userId, { subject, topic, durationMinutes });
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to create study plan" });
  }
});

router.patch("/plans/:id", objectBody, async (req, res) => {
  try {
    const plan = await updateStudyPlan(req.userId, req.params.id, req.body);
    res.json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to update study plan" });
  }
});

// --------------------------------------------------------------------------
// 4. PRACTICE QUIZ GENERATOR & EVALUATOR
// --------------------------------------------------------------------------

router.post("/practice/generate", objectBody, async (req, res) => {
  try {
    const { subject = "english", topic = "General Practice" } = req.body;
    const quiz = await generatePracticeQuiz(req.userId, subject, topic);
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to generate practice quiz" });
  }
});

// --------------------------------------------------------------------------
// 5. PROGRAMMING MENTOR CODE ANALYSIS (No untrusted server execution)
// --------------------------------------------------------------------------

router.post("/code/analyze", objectBody, async (req, res) => {
  try {
    const { language = "c", code, question } = req.body;
    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Code snippet is required" });
    }

    const prompt =
      `Review and explain this ${language} code snippet. Do NOT execute it.\n` +
      `Question/Context: ${question || "Explain how this code works, identify any potential bugs or edge cases, and suggest improvements."}\n\n` +
      `\`\`\`${language}\n${code.slice(0, 4000)}\n\`\`\``;

    const completion = await generateAiCompletion({
      userId: req.userId,
      messages: [{ sender: "student", content: prompt }],
      systemPrompt:
        "You are the Novyra Programming Mentor. Explain code clearly, point out syntax traps or algorithmic flaws, " +
        "and suggest step-by-step improvements. Provide hints before complete solutions.",
    });

    res.json({
      analysis: completion.text,
      language,
      provider: completion.provider,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to analyze code" });
  }
});

// --------------------------------------------------------------------------
// 6. USAGE & QUOTA
// --------------------------------------------------------------------------

router.get("/usage", async (req, res) => {
  try {
    const date = getTodayKey();
    const usage = await NovyraUsage.findOne({ userId: req.userId, date }).lean();
    const quota = await checkUserQuota(req.userId);

    res.json({
      date,
      tokensUsedToday: usage?.totalTokens || 0,
      requestsToday: usage?.requestCount || 0,
      dailyTokenLimit: Number(process.env.NOVYRA_DAILY_TOKEN_LIMIT || 150000),
      dailyRequestLimit: Number(process.env.NOVYRA_DAILY_REQUEST_LIMIT || 200),
      allowed: quota.allowed,
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch usage statistics" });
  }
});

export default router;
