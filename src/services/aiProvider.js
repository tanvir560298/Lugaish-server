import {createAiCapacity} from './aiCapacity.js';
import {aiConfiguration} from './aiConfig.js';
import {reserveAiBudget} from './aiBudget.js';
import {readProviderEvents} from './aiStream.js';
import { NovyraUsage } from "../models/NovyraUsage.js";
import { answerHtmlCourseQuestion } from "./lugaishCurriculum.js";

const DEFAULT_TIMEOUT_MS = 25000;
const acquireOnline=createAiCapacity(Math.max(1,Math.min(16,Number(process.env.NOVYRA_MAX_CONCURRENT_REQUESTS)||4)));
const DAILY_TOKEN_LIMIT = Number(process.env.NOVYRA_DAILY_TOKEN_LIMIT || 150000);
const DAILY_REQUEST_LIMIT = Number(process.env.NOVYRA_DAILY_REQUEST_LIMIT || 200);

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function checkUserQuota(userId) {
  if (!userId) return { allowed: false, reason: 'Authenticated student required.' };
  const date = getTodayKey();
  try {
    const usage = await NovyraUsage.findOne({ userId, date });
    if (!usage) return { allowed: true, currentTokens: 0, currentRequests: 0 };

    if (usage.totalTokens >= DAILY_TOKEN_LIMIT) {
      return {
        allowed: false,
        reason: "Daily token allowance reached. Please return tomorrow.",
        currentTokens: usage.totalTokens,
        currentRequests: usage.requestCount,
      };
    }

    if (usage.requestCount >= DAILY_REQUEST_LIMIT) {
      return {
        allowed: false,
        reason: "Daily request limit reached. Please return tomorrow.",
        currentTokens: usage.totalTokens,
        currentRequests: usage.requestCount,
      };
    }

    return {
      allowed: true,
      currentTokens: usage.totalTokens,
      currentRequests: usage.requestCount,
    };
  } catch {
    return { allowed: false, reason: 'Usage allowance could not be verified. Please retry.' };
  }
}

export async function recordTokenUsage(userId, promptTokens = 0, completionTokens = 0) {
  if (!userId) return;
  // Skip DB recording if userId is not a valid 24-hex string or ObjectId
  if (typeof userId === "string" && !/^[0-9a-fA-F]{24}$/.test(userId)) return;
  const date = getTodayKey();
  const totalTokens = promptTokens + completionTokens;
  // Estimated cost in cents (approx $0.15 per million tokens for lightweight models)
  const costEstimatedCents = Math.round((totalTokens / 1000000) * 15);

  try {
    await NovyraUsage.findOneAndUpdate(
      { userId, date },
      {
        $inc: {
          promptTokens,
          completionTokens,
          totalTokens,
          requestCount: 1,
          costEstimatedCents,
        },
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    // Non-fatal logging for telemetry
    console.warn("Failed to record Tanu AI usage:", err?.message);
  }
}

// --------------------------------------------------------------------------
// PROVIDER IMPLEMENTATIONS
// --------------------------------------------------------------------------

export async function callGeminiApi({ messages, systemPrompt, jsonMode, maxTokens = 2048, apiKey, onDelta, signal }) {
  const model = process.env.NOVYRA_MODEL_NAME || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:${onDelta?'streamGenerateContent?alt=sse':'generateContent'}`;

  const contents = [];
  for (const m of messages) {
    const role = m.sender === "novyra" ? "model" : "user";
    contents.push({
      role,
      parts: [{ text: m.content }],
    });
  }

  const body = {
    contents,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.7,
      ...(jsonMode ? { responseMimeType: "application/json" } : {}),
    },
  };

  if (systemPrompt) {
    body.systemInstruction = {
      parts: [{ text: systemPrompt }],
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key":apiKey },
      body: JSON.stringify(body),
      signal: signal ? AbortSignal.any([controller.signal,signal]) : controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${errText.slice(0, 300)}`);
    }

    if(onDelta){let text='',usage={},finished=false;await readProviderEvents(res.body,event=>{if(event.error)throw Error('Provider stream failed.');const candidate=event.candidates?.[0];if(candidate?.finishReason)finished=true;const delta=candidate?.content?.parts?.filter(p=>!p.thought).map(p=>p.text||'').join('')||'';if(delta){text+=delta;onDelta(delta);}if(event.usageMetadata)usage=event.usageMetadata;});if(!text||!finished)throw Error('Provider stream was interrupted.');return{text,provider:'gemini',model,promptTokens:usage.promptTokenCount||0,completionTokens:(usage.candidatesTokenCount||0)+(usage.thoughtsTokenCount||0)};}
    const data = await res.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.map((p) => p.text).join("") || "";
    const promptTokens = data.usageMetadata?.promptTokenCount || Math.round(JSON.stringify(contents).length / 4);
    const completionTokens = data.usageMetadata?.candidatesTokenCount || Math.round(text.length / 4);

    return {
      text,
      provider: "gemini",
      model,
      promptTokens,
      completionTokens,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function callOpenAiApi({ messages, systemPrompt, jsonMode, maxTokens = 2048, apiKey, onDelta, signal }) {
  const model = process.env.NOVYRA_MODEL_NAME || "gpt-4o-mini";
  const url = "https://api.openai.com/v1/chat/completions";

  const formattedMessages = [];
  if (systemPrompt) {
    formattedMessages.push({ role: "system", content: systemPrompt });
  }

  for (const m of messages) {
    const role = m.sender === "novyra" ? "assistant" : m.sender === "system" ? "system" : "user";
    formattedMessages.push({ role, content: m.content });
  }

  const body = {
    model,
    messages: formattedMessages,
    max_completion_tokens: maxTokens,
    ...(onDelta?{stream:true,stream_options:{include_usage:true}}:{}),
    ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: signal ? AbortSignal.any([controller.signal,signal]) : controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${errText.slice(0, 300)}`);
    }

    if(onDelta){let text='',usage={},finished=false;await readProviderEvents(res.body,event=>{if(event.error)throw Error('Provider stream failed.');if(event.choices?.[0]?.finish_reason)finished=true;const delta=event.choices?.[0]?.delta?.content||'';if(delta){text+=delta;onDelta(delta);}if(event.usage)usage=event.usage;});if(!text||!finished)throw Error('Provider stream was interrupted.');return{text,provider:'openai',model,promptTokens:usage.prompt_tokens||0,completionTokens:usage.completion_tokens||0};}
    const data = await res.json();
    const choice = data.choices?.[0];
    const text = choice?.message?.content || "";
    const promptTokens = data.usage?.prompt_tokens || Math.round(JSON.stringify(formattedMessages).length / 4);
    const completionTokens = data.usage?.completion_tokens || Math.round(text.length / 4);

    return {
      text,
      provider: "openai",
      model,
      promptTokens,
      completionTokens,
    };
  } finally {
    clearTimeout(timer);
  }
}

// --------------------------------------------------------------------------
// PEDAGOGICAL FALLBACK ENGINE (High-fidelity offline / keyless tutor)
// --------------------------------------------------------------------------

const SUBJECT_KNOWLEDGE = {
  java: {
    name: "Java",
    categories: ["Loops", "OOP", "Collections", "Exception Handling", "Streams"],
    loopConcept:
      "In Java, loops allow code blocks to execute repeatedly based on a boolean condition.\n\n" +
      "### 1. `for` Loop (Best for known counts)\n" +
      "```java\nfor (int i = 0; i < 5; i++) {\n    System.out.println(\"Count: \" + i);\n}\n```\n\n" +
      "### 2. Enhanced `for-each` (Best for arrays/collections)\n" +
      "```java\nString[] fruits = {\"Apple\", \"Banana\", \"Cherry\"};\nfor (String fruit : fruits) {\n    System.out.println(fruit);\n}\n```\n\n" +
      "### 3. `while` Loop (Condition checked before entry)\n" +
      "```java\nint count = 0;\nwhile (count < 3) {\n    System.out.println(count);\n    count++;\n}\n```\n\n" +
      "### 4. `do-while` Loop (Executes at least once)\n" +
      "```java\nint n = 0;\ndo {\n    System.out.println(n);\n    n++;\n} while (n < 3);\n```",
    sampleQuestions: [
      {
        question: "Which loop in Java is guaranteed to execute its block at least once?",
        options: ["for loop", "while loop", "do-while loop", "enhanced for-each"],
        correctIndex: 2,
        explanation: "The do-while loop evaluates its boolean condition after executing the body, ensuring at least one execution.",
      },
      {
        question: "What statement is used to immediately terminate a loop in Java?",
        options: ["stop", "break", "continue", "exit"],
        correctIndex: 1,
        explanation: "The `break` keyword halts the closest enclosing loop immediately.",
      },
    ],
  },
  python: {
    name: "Python",
    categories: ["Data Types", "Functions", "OOP", "List Comprehensions", "Generators"],
    sampleQuestions: [
      {
        question: "What is the output of `[x**2 for x in range(3)]` in Python?",
        options: ["[0, 1, 4]", "[1, 4, 9]", "[0, 1, 2]", "[1, 2, 3]"],
        correctIndex: 0,
        explanation: "range(3) produces 0, 1, 2. Squaring each gives [0, 1, 4].",
      },
    ],
  },
  c: {
    name: "C",
    categories: ["Pointers", "Memory Allocation", "Structs", "Arrays", "Preprocessors"],
    sampleQuestions: [
      {
        question: "Which function allocates uninitialized dynamic memory on the heap in C?",
        options: ["calloc()", "malloc()", "realloc()", "free()"],
        correctIndex: 1,
        explanation: "`malloc(size_t size)` allocates the requested number of bytes without zero-initializing them.",
      },
    ],
  },
  javascript: {
    name: "JavaScript",
    categories: ["Closures", "Promises & Async", "DOM", "Prototypes", "Event Loop"],
    sampleQuestions: [
      {
        question: "Which keyword creates a block-scoped variable that cannot be reassigned?",
        options: ["var", "let", "const", "static"],
        correctIndex: 2,
        explanation: "`const` declares a block-scoped identifier that cannot be reassigned after initialization.",
      },
    ],
  },
  english: {
    name: "English",
    categories: ["Grammar", "Speaking", "Vocabulary", "Pronunciation", "IELTS Preparation"],
    sampleQuestions: [
      {
        question: "Choose the sentence with correct subject-verb agreement:",
        options: [
          "Either the teacher or the students is coming.",
          "Either the teacher or the students are coming.",
          "Neither of the books are interesting.",
          "Every student and teacher were present.",
        ],
        correctIndex: 1,
        explanation: "When subjects are joined by 'either... or', the verb agrees with the closer subject ('students are').",
      },
    ],
  },
  arabic: {
    name: "Arabic",
    categories: ["Grammar (Nahw)", "Morphology (Sarf)", "Daily Conversation", "Vocabulary", "Reading"],
    sampleQuestions: [
      {
        question: "Which vowel mark (Harakat) indicates the nominative case (Marfoo') in classical Arabic?",
        options: ["Fatha (َ)", "Damma (ُ)", "Kasra (ِ)", "Sukun (ْ)"],
        correctIndex: 1,
        explanation: "Damma (ُ) is the primary marker for the nominative case (Al-Raf').",
      },
    ],
  },
  web_dev: {
    name: "Web Development",
    categories: ["HTML structure", "Text and headings", "Links and images", "Forms and containers", "Lists and first portfolio"],
    sampleQuestions: [
      {
        question: "Which HTML element is used for the main heading of a page?",
        options: ["<p>", "<h1>", "<span>", "<br>"],
        correctIndex: 1,
        explanation: "Use a clear <h1> for the page's main heading, then choose lower heading levels to show sections.",
      },
      {
        question: "Which attribute tells an anchor element where its link should go?",
        options: ["src", "alt", "href", "class"],
        correctIndex: 2,
        explanation: "The href attribute contains the link destination for an <a> element.",
      },
      {
        question: "Which list element holds each individual list item?",
        options: ["<li>", "<ul>", "<ol>", "<list>"],
        correctIndex: 0,
        explanation: "Use <li> for each item, inside an ordered <ol> or unordered <ul> list.",
      },
    ],
  },
  computer_science: {
    name: "Computer Science",
    categories: ["Data Structures", "Algorithms & Complexity", "Operating Systems", "Networking", "Databases"],
    sampleQuestions: [
      {
        question: "What is the average time complexity of searching in a balanced Binary Search Tree (BST)?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctIndex: 1,
        explanation: "Because each comparison halves the search space in a balanced tree, the height and search complexity is O(log n).",
      },
    ],
  },
};

export function runPedagogicalEngine({ messages = [], systemPrompt = "", jsonMode = false, tools = [] }) {
  const latestMessage = messages[messages.length - 1]?.content || "";
  const lowerMsg = latestMessage.toLowerCase();

  // Detect subject
  let subject = systemPrompt.match(/current student-selected subject is \"([^\"]+)\"/i)?.[1] || "general";
  const explicitSubject = [
    ["web_dev", /\b(?:html|web[\s_-]*development|heading tags|live server|div\s*(?:and|&)\s*span)\b/i],
    ["javascript", /\bjavascript\b/i],
    ["python", /\bpython\b/i],
    ["java", /\bjava\b/i],
    ["computer_science", /\bcomputer science\b/i],
    ["arabic", /\barabic\b/i],
    ["english", /\benglish\b/i],
    ["c", /\b(?:c language|c programming|c pointers)\b/i],
  ].find(([, pattern]) => pattern.test(latestMessage));
  if (explicitSubject) subject = explicitSubject[0];
  if (!SUBJECT_KNOWLEDGE[subject]) subject = "general";
  const prefersBengali = /preferred explanation language is bengali/i.test(systemPrompt);

  // 1. JSON Mode: Handle Study Plan or Quiz Requests
  if (jsonMode) {
    if (!lowerMsg.includes("plan") && (lowerMsg.includes("quiz") || lowerMsg.includes("test") || lowerMsg.includes("question"))) {
      const data = SUBJECT_KNOWLEDGE[subject] || SUBJECT_KNOWLEDGE.java;
      const questions = data.sampleQuestions;

      return {
        text: JSON.stringify({
          subject,
          topic: "Quick Mastery Check",
          questions,
        }),
        provider: "pedagogical_engine",
        model: "novyra-tutor-v2",
        promptTokens: 60,
        completionTokens: 180,
      };
    }

    // Default JSON response: Structured Study Plan
    const duration = Number(lowerMsg.match(/(\d+)[-\s]*min/)?.[1]) || 60;
    const requestedTopic = latestMessage.match(/focusing on (.+?)(?:\.\s*include timed blocks|$)/i)?.[1]?.trim();
    const topic = requestedTopic || (lowerMsg.includes("loop")
      ? "Loops & Iterations"
      : lowerMsg.includes("function")
      ? "Functions & Scope"
      : "Core Fundamentals");
    const htmlCourse = subject === "web_dev";
    const bengaliPlan = /preferred explanation language: bengali/i.test(systemPrompt);
    const requestedHtmlClass = htmlCourse && topic.match(/class\s*0?([1-7])/i);
    const htmlLessonPath = requestedHtmlClass
      ? `/learn/web-development/html/${String(Number(requestedHtmlClass[1])).padStart(2, "0")}`
      : "/learn/web-development/html";

    const blocks = [
      {
        id: "block-1",
        title: bengaliPlan ? `${topic}: বিষয়টি বুঝে নাও` : `Core Concept: ${topic}`,
        type: "concept",
        durationMinutes: Math.round(duration * 0.35),
        objectives: [`Understand syntax and runtime flow of ${topic}`, "Review standard code patterns and edge cases"],
        instructions: htmlCourse && bengaliPlan
          ? `Lugaish-এর ${topic} HTML lesson খোলো। অল্প করে দেখো, মাঝে থেমে মূল ধারণাটি নিজের ভাষায় লিখে নাও।`
          : htmlCourse
          ? `Open the Lugaish HTML lesson for ${topic}. Watch a short section, pause, and write down the idea in your own words.`
          : `Carefully read the explanations and trace the execution path for ${topic}.`,
        materials: htmlCourse ? [`Course lesson path: ${htmlLessonPath}`] : [`Interactive ${subject} lesson card`, "Code trace examples"],
      },
      {
        id: "block-2",
        title: htmlCourse && bengaliPlan ? `${topic} দিয়ে ছোট কিছু বানাও` : htmlCourse ? `Build a small example: ${topic}` : bengaliPlan ? "অনুশীলন করে দেখো" : "Guided Practice & Code Lab",
        type: htmlCourse || subject.includes("c") || subject.includes("java") || subject.includes("python") || subject.includes("javascript") ? "coding_exercise" : "practice",
        durationMinutes: Math.round(duration * 0.35),
        objectives: ["Solve 3 progressive challenge problems", "Identify and fix common syntax/logical traps"],
        instructions: htmlCourse && bengaliPlan
          ? "নিজের editor-এ আজকের বিষয়টি দিয়ে ছোট একটি HTML page বানাও। Browser-এ দেখে অন্তত একটি ভুল নিজে ঠিক করো।"
          : htmlCourse
          ? "Create or edit a small HTML page in your editor using today's idea. Check the browser result and fix one thing yourself."
          : "Implement the required logic independently. Request hints from Tanu AI before viewing complete solutions.",
        materials: htmlCourse ? [`Course lesson path: ${htmlLessonPath}`] : ["Interactive exercise prompt"],
      },
      {
        id: "block-3",
        title: bengaliPlan ? "ছোট বিরতি নাও" : "Mind Reset & Quick Break",
        type: "break",
        durationMinutes: Math.max(5, Math.round(duration * 0.1)),
        objectives: ["Step away from the screen", "Hydrate and stretch before assessment"],
        instructions: bengaliPlan ? "চোখকে বিশ্রাম দাও, একটু পানি খাও, আর কয়েক মিনিট হাঁটো।" : "Rest your eyes. Take deep breaths for 5 minutes.",
        materials: [],
      },
      {
        id: "block-4",
        title: bengaliPlan ? "নিজেকে যাচাই করো" : "Knowledge Check Quiz",
        type: "quiz",
        durationMinutes: Math.round(duration * 0.15),
        objectives: ["Verify mastery under timed conditions", "Pinpoint remaining weak areas"],
        instructions: htmlCourse && bengaliPlan
          ? "নোট না দেখে মূল ধারণাটি নিজের ভাষায় বোঝাও। Practice Quizzes tab-এ একটি প্রশ্নের উত্তর দাও।"
          : htmlCourse
          ? "Without looking at your notes, explain the main idea and try a question in the Practice Quizzes tab."
          : bengaliPlan ? "নোট না দেখে অনুশীলনের প্রশ্নগুলোর উত্তর দাও। আটকে গেলে কোন জায়গাটি কঠিন লেগেছে লিখে রাখো." : "Answer the practice questions without referencing outside notes.",
        materials: [htmlCourse ? "Tanu HTML practice questions" : "Practice questions"],
      },
      {
        id: "block-5",
        title: bengaliPlan ? "আজ কী শিখলে, লিখে রাখো" : "Reflection & Next Step Plan",
        type: "reflection",
        durationMinutes: Math.max(5, Math.round(duration * 0.05)),
        objectives: ["Log what was mastered today", "Record unresolved questions for tomorrow"],
        instructions: bengaliPlan ? "আজকের শেখা বিষয়টি নিয়ে দুই বাক্য লেখো; পরেরবার কী অনুশীলন করবে সেটিও ঠিক করো।" : "Write a short 2-sentence summary of your key takeaway.",
        materials: [],
      },
    ];

    // Reserve one minute per block, then distribute the remainder exactly.
    const weights = [0.35, 0.35, 0.10, 0.15, 0.05];
    let remaining = Math.max(5, Math.round(duration)) - blocks.length;
    blocks.forEach((block, index) => {block.durationMinutes = 1 + Math.floor(remaining * weights[index]);});
    let remainder = Math.max(5, Math.round(duration)) - blocks.reduce((sum, block) => sum + block.durationMinutes, 0);
    for (let index = 0; remainder > 0; index++, remainder--) blocks[index % blocks.length].durationMinutes++;

    return {
      text: JSON.stringify({
        title: `Intelligent ${subject.toUpperCase()} Study Session: ${topic}`,
        subject,
        topic,
        targetDurationMinutes: duration,
        blocks,
        recommendedNextActivity: htmlCourse && bengaliPlan
          ? `${topic} আবার দেখে পরের HTML class-এ এগিয়ে যাও।`
          : htmlCourse
          ? `Continue with the next HTML class after reviewing ${topic}.`
          : bengaliPlan ? `${topic} থেকে একটি ছোট অনুশীলন করে আবার দেখে নাও।` : `Review ${topic} with one short practice activity.`,
      }),
      provider: "pedagogical_engine",
      model: "novyra-tutor-v2",
      promptTokens: 80,
      completionTokens: 240,
    };
  }

  if (subject === "web_dev") {
    const htmlReply = answerHtmlCourseQuestion(latestMessage, prefersBengali ? "bengali" : "english");
    return {
      text: `[Built-in Lugaish HTML course guide — limited offline help.]\n\n${htmlReply}`,
      provider: "pedagogical_engine",
      model: "novyra-tutor-v2",
      promptTokens: 100,
      completionTokens: Math.max(80, Math.round(htmlReply.length / 4)),
    };
  }

  // 2. Programming Code Explanation & Mentorship
  if (lowerMsg.includes("loop") && (subject === "java" || lowerMsg.includes("java"))) {
    return {
      text:
        "Hello! I am **Tanu AI**, your learning companion. Let's master Java loops step-by-step!\n\n" +
        SUBJECT_KNOWLEDGE.java.loopConcept +
        "\n\n### 💡 Tanu AI's Golden Rule for Loops:\n" +
        "1. Always verify your **loop termination condition** to prevent infinite loops.\n" +
        "2. Ensure the **iterator update** (`i++` or `count += 1`) moves toward the termination state.\n\n" +
        "Would you like to try a quick challenge, or would you like me to build a **personalized 60-minute study session** for you right now?",
      provider: "pedagogical_engine",
      model: "novyra-tutor-v2",
      promptTokens: 50,
      completionTokens: 250,
    };
  }

  // 3. Error analysis / debugging mentorship
  if (lowerMsg.includes("error") || lowerMsg.includes("exception") || lowerMsg.includes("fix my code")) {
    return {
      text:
        "### 🔍 Tanu AI Guided Code Diagnosis\n\n" +
        "Let's debug this together systematically without simply giving away the final answer:\n\n" +
        "1. **Check the Line of Occurrence**: Look at the line number reported in the stack trace.\n" +
        "2. **Identify Variable State**: Is any object reference `null` before you invoke a method on it (NullPointerException / TypeError)?\n" +
        "3. **Check Array / Collection Bounds**: Are you indexing `i <= array.length` instead of `i < array.length`?\n\n" +
        "Paste the exact snippet and error message you are seeing, and I will guide you to fix it step by step!",
      provider: "pedagogical_engine",
      model: "novyra-tutor-v2",
      promptTokens: 40,
      completionTokens: 160,
    };
  }

  // 4. Default pedagogical assistant greeting / response
  return {
    text:
      "Let’s start with one small thing. What are you trying to learn?\n\n" +
      "I’m using prepared learning guides right now, so I may not understand a general question. Try a specific starting point:\n" +
      "- **HTML help:** ‘What is the difference between h1 and h2?’\n" +
      "- **Study routine:** ‘Make me a 30-minute HTML study routine.’\n" +
      "- **Java loops:** ‘Explain a Java while loop.’\n\n" +
      "To test yourself, open **Practise a topic**. For your own code, open **Work on code**; a tailored review needs online AI.",
    provider: "pedagogical_engine",
    model: "novyra-tutor-v2",
    promptTokens: 40,
    completionTokens: 140,
  };
}

// --------------------------------------------------------------------------
// MAIN ENTRY POINT: generateAiCompletion
// --------------------------------------------------------------------------

export async function generateAiCompletion({
  userId,
  messages = [],
  systemPrompt = "",
  jsonMode = false,
  maxTokens = 2048,
  onDelta, signal,
}) {
  // Check user quota first
  if (userId) {
    const quota = await checkUserQuota(userId);
    if (!quota.allowed) {
      throw new Error(quota.reason);
    }
  }

  const config=aiConfiguration();
  const provider=config.provider;
  const paidEnabled=config.ready;
  const geminiKey=paidEnabled&&provider==='gemini'?process.env.GEMINI_API_KEY:null;
  const openAiKey=paidEnabled&&provider==='openai'?process.env.OPENAI_API_KEY:null;
  if(signal?.aborted)throw Error('Request cancelled.');
  const release=paidEnabled?acquireOnline(userId||'anonymous-provider-call'):()=>{};
  if(!release)throw Error('The online tutor is busy. Please retry shortly.');
  try {
  if(paidEnabled)await reserveAiBudget({messages,systemPrompt,maxTokens});

  let result = null;

  // 1. Try Gemini if configured or in auto mode with key
  if ((provider === "gemini" || provider === "auto") && geminiKey) {
    try {
      result = await callGeminiApi({ messages, systemPrompt, jsonMode, maxTokens, apiKey: geminiKey, onDelta, signal });
    } catch (err) {
      if(onDelta||signal?.aborted)throw Error('The online tutor could not respond. Please retry.');
      console.warn("Gemini request failed; using limited fallback.");
    }
  }

  // 2. Try OpenAI if configured or fallback with key
  if (!result && (provider === "openai" || provider === "auto") && openAiKey) {
    try {
      result = await callOpenAiApi({ messages, systemPrompt, jsonMode, maxTokens, apiKey: openAiKey, onDelta, signal });
    } catch (err) {
      if(onDelta||signal?.aborted)throw Error('The online tutor could not respond. Please retry.');
      console.warn("OpenAI request failed; using limited fallback.");
    }
  }

  // 3. Resilient Pedagogical Fallback Engine
  if (!result) {
    result = runPedagogicalEngine({ messages, systemPrompt, jsonMode });
    result.text = jsonMode ? result.text : '[Offline template mode — not an AI-generated answer.]\n\n' + result.text;
  }

  if(!result.text?.trim())throw Error('The tutor returned an empty response. Please retry.');
  // Record usage
  if (userId && result) {
    await recordTokenUsage(userId, result.promptTokens, result.completionTokens);
  }

  return result;
  } finally {release();}
}
