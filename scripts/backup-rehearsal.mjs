// This rehearsal can connect only to disposable local databases it creates.
import mongoose from "mongoose";
import { mkdtemp, writeFile, readFile, chmod } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
const prefix = `lugaish_restore_test_${process.pid}_${Date.now()}`,
  source = prefix + "_source",
  target = prefix + "_target",
  folder = await mkdtemp("/tmp/lugaish-backup-rehearsal-");
await chmod(folder, 0o700);
const uri = (name) => `mongodb://127.0.0.1:27017/${name}`,
  digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const run = (tool, args) => {
  const r = spawnSync(tool, args, { encoding: "utf8" });
  if (r.status !== 0)
    throw Error(`${tool} failed; no private tool output printed`);
};
try {
  await mongoose.connect(uri(source));
  const db = mongoose.connection.db;
  await db.collection("users").insertOne({ fixture: true, role: "learner" });
  await db.collection("lessons").insertOne({
    language: "english",
    day: 1,
    courseGeneration: "fixture",
    publicationStatus: "archived",
  });
  await db
    .collection("studynotes")
    .insertOne({ fixture: true, body: "Sanitized recovery fixture" });
  await db
    .collection("studytablemessages")
    .insertOne({ fixture: true, body: "Sanitized private fixture" });
  // Include cross-collection learning references introduced by Phases 16–17.
  const studentId = (await db.collection("users").findOne())._id;
  const quizId = new mongoose.Types.ObjectId();
  await db.collection("quizzes").insertOne({
    _id: quizId,
    userId: studentId,
    language: "english",
    courseGeneration: "fixture",
    requestId: "isolated-initial-attempt",
    day: 1,
    responses: [{ questionIndex: 0, selectedAnswer: 1, isCorrect: false }],
    totalQuestions: 1,
    completionEligible: false,
    score: 0,
    completedAt: new Date("2026-10-01T09:00:00Z"),
  });
  await db.collection("reviewattempts").insertOne({
    userId: studentId,
    sourceQuiz: quizId,
    language: "english",
    courseGeneration: "fixture",
    requestId: "isolated-review-attempt",
    questionIndex: 0,
    selectedAnswer: 0,
    isCorrect: true,
    completedAt: new Date("2026-10-02T09:00:00Z"),
  });
  await db.collection("progresses").insertOne({
    userId: studentId,
    language: "english",
    courseGeneration: "fixture",
    completedDays: [
      { day: 1, completedAt: new Date("2026-10-02T09:00:00Z"), score: 100 },
    ],
  });
  await db
    .collection("lessons")
    .createIndex(
      { language: 1, day: 1, courseGeneration: 1 },
      { unique: true },
    );
  await db
    .collection("reviewattempts")
    .createIndex({ userId: 1, requestId: 1 }, { unique: true });
  const expected = {};
  for (const c of [
    "users",
    "lessons",
    "studynotes",
    "studytablemessages",
    "quizzes",
    "reviewattempts",
    "progresses",
  ])
    expected[c] = await db.collection(c).find().toArray();
  await mongoose.disconnect();
  const dumpConfig = folder + "/dump.json",
    restoreConfig = folder + "/restore.json",
    archive = folder + "/snapshot.gz";
  await writeFile(dumpConfig, JSON.stringify({ uri: uri(source) }), {
    mode: 0o600,
  });
  await writeFile(restoreConfig, JSON.stringify({ uri: uri(target) }), {
    mode: 0o600,
  });
  run("mongodump", ["--config", dumpConfig, "--archive=" + archive, "--gzip"]);
  await chmod(archive, 0o600);
  const checksum = digest(await readFile(archive));
  await writeFile(archive + ".sha256", checksum, { mode: 0o600 });
  assert.equal(digest(await readFile(archive)), checksum);
  run("mongorestore", [
    "--config",
    restoreConfig,
    "--archive=" + archive,
    "--gzip",
    "--nsInclude=" + source + ".*",
    "--nsFrom=" + source + ".*",
    "--nsTo=" + target + ".*",
    "--stopOnError",
  ]);
  await mongoose.connect(uri(target));
  for (const [c, records] of Object.entries(expected))
    assert.deepEqual(
      await mongoose.connection.db.collection(c).find().toArray(),
      records,
    );
  assert.ok(
    (await mongoose.connection.db.collection("lessons").indexes()).some(
      (i) => i.unique && i.key.courseGeneration === 1,
    ),
  );
  assert.ok(
    (await mongoose.connection.db.collection("reviewattempts").indexes()).some(
      (index) =>
        index.unique && index.key.userId === 1 && index.key.requestId === 1,
    ),
  );
  const review = await mongoose.connection.db
    .collection("reviewattempts")
    .findOne();
  assert.ok(
    await mongoose.connection.db
      .collection("quizzes")
      .findOne({ _id: review.sourceQuiz, userId: review.userId }),
  );
  console.log(
    JSON.stringify(
      {
        rehearsal: "PASS",
        isolatedLocalOnly: true,
        restoredCollections: Object.keys(expected),
        indexesRestored: true,
        verifiedLearningReferencesRestored: true,
        verifiedChecksum: true,
        privateFixtureArchive: archive,
      },
      null,
      2,
    ),
  );
} finally {
  for (const name of [target, source]) {
    await mongoose.disconnect();
    await mongoose.connect(uri(name));
    if (mongoose.connection.name === name && name.startsWith(prefix))
      await mongoose.connection.dropDatabase();
  }
  await mongoose.disconnect();
}
