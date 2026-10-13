import mongoose from "mongoose";
import config from "../src/config.js";
import { mkdir, writeFile, readFile, chmod } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { resolve } from "node:path";
const args = process.argv.slice(2),
  mode = args[0],
  arg = (f) => (args.includes(f) ? args[args.indexOf(f) + 1] : undefined);
if (
  !["inventory", "backup", "archive", "restore", "publication-index"].includes(
    mode,
  ) ||
  !arg("--database") ||
  arg("--database").startsWith("--")
)
  throw Error(
    "Specify inventory|backup|archive|restore and --database EXACT_NAME; no default target",
  );
if (mode !== "inventory" && !arg("--backup"))
  throw Error("Verified backup file is mandatory");
await mongoose.connect(config.MONGODB_URI);
const db = mongoose.connection.db;
try {
  if (db.databaseName !== arg("--database"))
    throw Error("Database confirmation mismatch");
  const EJSON = mongoose.mongo.BSON.EJSON,
    hash = (s) => createHash("sha256").update(s).digest("hex"),
    counts = {};
  for (const c of await db.listCollections().toArray())
    counts[c.name] = await db.collection(c.name).countDocuments();
  if (mode === "inventory") {
    // Read-only publication counts; never print course bodies, account identifiers or media URLs.
    const publication = {};
    for (const [name, field] of [
      ["courses", "status"],
      ["lessons", "publicationStatus"],
    ]) {
      const collection = db.collection(name);
      publication[name] = {};
      for (const status of ["draft", "published", "archived"])
        publication[name][status] = await collection.countDocuments({
          [field]: status,
        });
      publication[name].missingMetadata = await collection.countDocuments({
        [field]: { $exists: false },
      });
    }
    const generations = await db
      .collection("courses")
      .find(
        { status: "published" },
        { projection: { language: 1, generation: 1 } },
      )
      .toArray();
    const filters = generations
      .filter(
        (course) => typeof course.generation === "string" && course.generation,
      )
      .map((course) => ({
        language: course.language,
        courseGeneration: course.generation,
        publicationStatus: "published",
      }));
    const activeLessons = filters.length
      ? await db.collection("lessons").countDocuments({ $or: filters })
      : 0;
    console.log(
      JSON.stringify(
        {
          database: db.databaseName,
          readOnly: true,
          counts,
          publication,
          activeLessons,
        },
        null,
        2,
      ),
    );
  } else {
    if (!arg("--backup")) throw Error("Verified backup file is mandatory");
    const path = resolve(arg("--backup"));
    if (mode === "backup") {
      if (!path.startsWith("/private/tmp/") && !path.startsWith("/tmp/"))
        throw Error(
          "Backup must be outside source in a private temporary directory",
        );
      await mkdir(resolve(path, ".."), { recursive: true, mode: 0o700 });
      await chmod(resolve(path, ".."), 0o700);
      const records = {};
      for (const name of Object.keys(counts))
        records[name] = await db.collection(name).find().toArray();
      const text = EJSON.stringify({
        version: 1,
        database: db.databaseName,
        batch: randomUUID(),
        records,
      });
      await writeFile(path, text, { flag: "wx", mode: 0o600 });
      const actual = await readFile(path, "utf8"),
        parsed = EJSON.parse(actual);
      if (
        hash(actual) !== hash(text) ||
        Object.entries(counts).some(
          ([name, n]) => parsed.records[name].length !== n,
        )
      )
        throw Error("Backup verification failed");
      await writeFile(path + ".sha256", hash(actual), {
        flag: "wx",
        mode: 0o600,
      });
      console.log(JSON.stringify({ verified: true, path, counts }, null, 2));
    } else {
      const text = await readFile(path, "utf8");
      if (hash(text) !== (await readFile(path + ".sha256", "utf8")).trim())
        throw Error("Backup checksum mismatch");
      const backup = EJSON.parse(text);
      if (backup.database !== db.databaseName || backup.version !== 1)
        throw Error("Backup target mismatch");
      if (mode === "archive") {
        for (const name of ["lessons", "courses"])
          if (
            EJSON.stringify(await db.collection(name).find().toArray()) !==
            EJSON.stringify(backup.records[name] || [])
          )
            throw Error("Records changed since backup; take a fresh backup");
        const lessons = await db.collection("lessons").updateMany(
            {
              _id: { $in: (backup.records.lessons || []).map((r) => r._id) },
            },
            {
              $set: {
                publicationStatus: "archived",
                courseResetBatch: backup.batch,
              },
            },
          ),
          courses = await db.collection("courses").updateMany(
            {
              _id: { $in: (backup.records.courses || []).map((r) => r._id) },
            },
            { $set: { status: "archived", courseResetBatch: backup.batch } },
          );
        console.log(
          JSON.stringify({
            archivedLessons: lessons.modifiedCount,
            archivedCourses: courses.modifiedCount,
            deleted: 0,
            usersModified: 0,
          }),
        );
      } else if (mode === "publication-index") {
        const collection = db.collection("lessons"),
          indexes = await collection.indexes();
        const indexPath = path + ".indexes-before.json";
        try {
          await writeFile(indexPath, EJSON.stringify(indexes), {
            flag: "wx",
            mode: 0o600,
          });
        } catch (error) {
          if (error.code !== "EEXIST") throw error;
        }
        await collection.createIndex(
          { language: 1, day: 1, courseGeneration: 1 },
          { unique: true, name: "language_1_day_1_courseGeneration_1" },
        );
        for (const index of indexes)
          if (
            index.unique &&
            Object.keys(index.key).length === 2 &&
            index.key.language === 1 &&
            index.key.day === 1
          )
            await collection.dropIndex(index.name);
        console.log(
          JSON.stringify({ versionedLessonIndex: true, deletedRecords: 0 }),
        );
      } else {
        // Only archive-touched records are restored; all independent data remains untouched.
        const pending = [];
        for (const name of ["lessons", "courses"])
          for (const original of backup.records[name] || []) {
            const current = await db
              .collection(name)
              .findOne({ _id: original._id });
            if (EJSON.stringify(current) === EJSON.stringify(original))
              continue; // Safe resume after an interrupted restore.
            if (current?.courseResetBatch !== backup.batch)
              throw Error("Restore conflict: archive marker changed");
            const stripped = { ...current };
            delete stripped.courseResetBatch;
            if (name === "lessons") {
              if (original.publicationStatus === undefined)
                delete stripped.publicationStatus;
              else stripped.publicationStatus = original.publicationStatus;
            } else stripped.status = original.status;
            if (EJSON.stringify(stripped) !== EJSON.stringify(original))
              throw Error("Restore conflict: record edited");
            pending.push({ name, original, current });
          }
        // Validate the whole restore before changing anything. Use a maintenance window
        // to prevent concurrent authoring; independent collections are never restored.
        for (const { name, original, current } of pending) {
          const result = await db.collection(name).replaceOne(
            {
              _id: original._id,
              courseResetBatch: backup.batch,
              updatedAt: current.updatedAt,
            },
            original,
          );
          if (result.matchedCount !== 1)
            throw Error(
              "Concurrent restore conflict; retry only after reviewing authoring changes",
            );
        }
        console.log(
          JSON.stringify({ restored: true, deleted: 0, usersModified: 0 }),
        );
      }
    }
  }
} finally {
  await mongoose.disconnect();
}
