import {aiConfiguration} from '../services/aiConfig.js';
import {createAiCapacity} from '../services/aiCapacity.js';
import express from "express";
import { randomUUID } from "node:crypto";
import { authMiddleware } from "../middleware/auth.js";
import { objectBody } from "../middleware/requestShape.js";
import { User } from "../models/User.js";
import { createRateLimit } from "../middleware/rateLimit.js";
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
import { HTML_COURSE_CONTEXT, HTML_COURSE_LESSONS } from "../services/lugaishCurriculum.js";

const router = express.Router();
const acquireAi=createAiCapacity(Math.max(1,Math.min(16,Number(process.env.NOVYRA_MAX_CONCURRENT_REQUESTS)||4)));
router.use(authMiddleware);
router.use(async (req, res, next) => {
  try {
    if (!await User.exists({_id:req.userId})) return res.status(401).json({error:'Account unavailable'});
    next();
  } catch {res.status(503).json({error:'Account access could not be verified'});}
});
router.use(createRateLimit({windowMs:60000, max:30, key:req=>req.userId}));
router.use((req, res, next) => {
  for (const key of ['sessionId','subject','topic','language','question','code','message']) {
    const value = req.body?.[key] ?? req.query?.[key];
    if (value !== undefined && (typeof value !== 'string' || value.length > (key === 'code' ? 4000 : key === 'message' ? 12000 : 500)))
      return res.status(400).json({error:`Invalid ${key}`});
  }
  if (req.body?.contextType !== undefined && !['general','workspace','daily_planner','classroom','study_room','speaking','programming'].includes(req.body.contextType))
    return res.status(400).json({error:'Invalid conversation context'});
  next();
});

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
    res.status(500).json({ error: "Failed to retrieve Tanu AI profile" });
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
    res.status(500).json({ error: "Failed to update Tanu AI profile" });
  }
});

// --------------------------------------------------------------------------
// 2. CONVERSATIONAL TUTOR & TOOL-CALLING CHAT
// --------------------------------------------------------------------------

router.post("/chat", objectBody, async (req, res) => {
  const release=acquireAi(req.userId);
  if(!release)return res.status(429).json({error:'Tanu is busy. Wait for your current reply, or try again shortly.'});
  const controller=new AbortController();let heartbeat;
  const disconnect=()=>{if(!res.writableEnded)controller.abort();};
  res.on('close',disconnect);
  const event=(type,data)=>{if(!res.destroyed)res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);};
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
    const studentProfile = await getStudentProfile(req.userId);
    const htmlFocused = subject === "web_dev" || /\b(html|web development|heading|paragraph|h[1-6]|live server|div and span|anchor|alt text)\b/i.test(message);
    const focusSubject = htmlFocused ? "web_dev" : subject;
    const wantsRoutine = /\b(study routine|study plan|study schedule|daily routine|make me a routine|create.*plan|routine)\b|পড়ার রুটিন|পড়ার পরিকল্পনা|স্টাডি রুটিন/i.test(message);
    let routineTopic = focusSubject === "web_dev"
      ? "HTML course practice"
      : studentProfile.weakAreas?.[0] || focusSubject;
    const requestedClass = focusSubject === "web_dev" && message.match(/\b(?:class|lesson)\s*0?([1-7])\b/i);
    if (requestedClass) {
      const lesson = HTML_COURSE_LESSONS[Number(requestedClass[1]) - 1];
      routineTopic = `HTML class ${lesson.id}: ${lesson.title}`;
    }
    const requestedDuration = wantsRoutine && message.match(/\b(\d{1,3})\s*(?:minutes?|mins?)\b/i);
    const routineDuration = requestedDuration && Number(requestedDuration[1]) >= 15 && Number(requestedDuration[1]) <= 120
      ? Number(requestedDuration[1])
      : null;
    const executedTools = [];

    if (lower.includes("my progress") || lower.includes("how am i doing")) {
      const progressData = await getVerifiedProgress(req.userId);
      executedTools.push({ name: "getVerifiedProgress", result: progressData });
    } else if (lower.includes("weak area") || lower.includes("my mistakes")) {
      const mistakeData = await getMistakeHistory(req.userId, focusSubject);
      executedTools.push({ name: "getMistakeHistory", result: mistakeData });
    } else if (lower.includes("what next") || lower.includes("recommend")) {
      const rec = await recommendNextActivity(req.userId, focusSubject);
      executedTools.push({ name: "recommendNextActivity", result: rec });
    }

    // System prompt with pedagogical instructions
    const systemPrompt =
      "You are Tanu AI, the learning companion on Lugaish. Teach one idea at a time, use plain language and small examples, " +
      "adjust depth to the student's level, ask a short check-for-understanding question, and offer a hint before a full solution. " +
      "Reply in Bengali when the student writes Bengali, including informal romanized Bengali. Answer the actual question before suggesting tools. Never repeat your introduction on follow-up questions. Keep the first answer short and useful. " +
      "Do not claim a student has mastered something without evidence. If you do not know, say so and ask a helpful follow-up. " +
      `The current student-selected subject is \"${focusSubject}\". ` +
      `The student is at ${studentProfile.experienceLevel} level, working toward ${studentProfile.primaryGoal}, ` +
      `and prefers explanations in ${studentProfile.explanationLanguage}. Their daily study target is ${studentProfile.dailyTimeMinutes} minutes. ` +
      (studentProfile.weakAreas?.length ? `Areas they asked to practise: ${studentProfile.weakAreas.slice(0, 5).join(", ")}. ` : "") +
      (focusSubject === "web_dev" ? `\nLugaish's published Web Development course currently teaches HTML only. Use this verified course outline and do not claim CSS, React, or full-stack lessons are available:\n${HTML_COURSE_CONTEXT}` : "") +
      (executedTools.length > 0 ? `\nContext data from platform tools: ${JSON.stringify(executedTools)}` : "");

    // Stream only on explicit opt-in; old clients still receive JSON.
    const streaming=req.body.stream===true;
    if(streaming){res.set({'Content-Type':'text/event-stream','Cache-Control':'no-cache, no-transform','X-Accel-Buffering':'no'});res.flushHeaders();heartbeat=setInterval(()=>{if(!res.destroyed)res.write(': keep-alive\n\n');},10000);}
    // Generate AI response
    const completion = await generateAiCompletion({
      userId: req.userId,
      messages: contextMessages,
      systemPrompt,
      maxTokens:1024,
      signal:controller.signal,
      ...(streaming?{onDelta:text=>event('delta',{text})}:{}),
    });
    if(controller.signal.aborted)return;

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
      ...(wantsRoutine ? { actionUrl: `/tanu?tab=planner&topic=${encodeURIComponent(routineTopic)}${routineDuration ? `&duration=${routineDuration}` : ""}` } : {}),
    };
    conversation.messages.push(novyraMsg);
    conversation.messages = conversation.messages.slice(-64);
    conversation.lastActivity = new Date();
    await conversation.save();

    const result={message:novyraMsg,provider:completion.provider,model:completion.model,avatarState};
    if(streaming){event('done',result);res.end();}else res.json(result);
  } catch (err) {
    if(!res.destroyed){const error={error:'Tanu could not finish this reply. Please retry. If this continues, the server’s AI connection or usage allowance needs attention.'};if(res.headersSent){event('error',error);res.end();}else res.status(503).json(error);}
  } finally {clearInterval(heartbeat);res.off('close',disconnect);release();}
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
    const profile = await getStudentProfile(req.userId);
    const plan = await createStudyPlan(req.userId, {
      subject,
      topic,
      durationMinutes,
      learnerContext: {
        experienceLevel: profile.experienceLevel,
        primaryGoal: profile.primaryGoal,
        explanationLanguage: profile.explanationLanguage,
        dailyTimeMinutes: profile.dailyTimeMinutes,
        weakAreas: profile.weakAreas,
      },
    });
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
    res.status(503).json({ error: "Practice generation is temporarily unavailable." });
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
        "You are the Tanu AI Programming Mentor. Explain code clearly, point out syntax traps or algorithmic flaws, " +
        "and suggest step-by-step improvements. Provide hints before complete solutions.",
    });

    res.json({
      analysis: completion.text,
      language,
      provider: completion.provider,
    });
  } catch (err) {
    res.status(503).json({ error: "Code analysis is temporarily unavailable." });
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
      engineMode: aiConfiguration().ready ? 'online-configured' : 'offline-template',
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
