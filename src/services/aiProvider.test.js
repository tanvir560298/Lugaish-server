import test from "node:test";
import assert from "node:assert/strict";
import {
  runPedagogicalEngine,
  getTodayKey,
} from "./aiProvider.js";

test("pedagogical engine returns structured study plan for Java loops in JSON mode", () => {
  const res = runPedagogicalEngine({
    messages: [{ sender: "student", content: "I am learning Java. I have 90 minutes today, and I struggle with loops." }],
    jsonMode: true,
  });

  assert.equal(res.provider, "pedagogical_engine");
  assert.equal(res.model, "novyra-tutor-v2");

  const plan = JSON.parse(res.text);
  assert.equal(plan.subject, "java");
  assert.equal(plan.targetDurationMinutes, 90);
  assert.ok(Array.isArray(plan.blocks));
  assert.ok(plan.blocks.length >= 4);

  const blockTypes = plan.blocks.map((b) => b.type);
  assert.ok(blockTypes.includes("concept"));
  assert.ok(blockTypes.includes("coding_exercise") || blockTypes.includes("practice"));
  assert.ok(blockTypes.includes("break"));
  assert.ok(blockTypes.includes("quiz"));
});

test("pedagogical engine generates verified practice quiz in JSON mode", () => {
  const res = runPedagogicalEngine({
    messages: [{ sender: "student", content: "Give me a practice quiz on C language pointers" }],
    jsonMode: true,
  });

  assert.equal(res.provider, "pedagogical_engine");
  const quiz = JSON.parse(res.text);
  assert.equal(quiz.subject, "c");
  assert.ok(Array.isArray(quiz.questions));
  assert.ok(quiz.questions.length > 0);
  assert.ok(quiz.questions[0].question);
  assert.ok(Array.isArray(quiz.questions[0].options));
  assert.equal(typeof quiz.questions[0].correctIndex, "number");
  assert.ok(quiz.questions[0].explanation);
});

test("pedagogical engine provides deep Java loop explanation with code syntax", () => {
  const res = runPedagogicalEngine({
    messages: [{ sender: "student", content: "Explain Java while loop vs do-while loop" }],
    jsonMode: false,
  });

  assert.equal(res.provider, "pedagogical_engine");
  assert.match(res.text, /for \(int i = 0/);
  assert.match(res.text, /do-while/);
  assert.match(res.text, /while \(count < 3\)/);
  assert.match(res.text, /Novyra's Golden Rule/);
});

test("pedagogical engine provides guided code debugging with hints before giving answers", () => {
  const res = runPedagogicalEngine({
    messages: [{ sender: "student", content: "I have a NullPointerException error, please fix my code" }],
    jsonMode: false,
  });

  assert.equal(res.provider, "pedagogical_engine");
  assert.match(res.text, /Novyra Guided Code Diagnosis/);
  assert.match(res.text, /Line of Occurrence/);
  assert.match(res.text, /NullPointerException/);
});

test("todayKey returns valid YYYY-MM-DD date string", () => {
  const key = getTodayKey();
  assert.match(key, /^\d{4}-\d{2}-\d{2}$/);
});
