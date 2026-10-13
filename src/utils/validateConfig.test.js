import test from "node:test";
import assert from "node:assert/strict";
import { validateProductionConfig } from "./validateConfig.js";

const validConfig = {
  APP_ENV: "production",
  FRONTEND_URL: "https://lugaish.example",
  FIREBASE_PROJECT_ID: "fixture-project",
  JWT_SECRET: "a-secure-production-secret-that-is-long-enough",
  MONGODB_URI: "mongodb+srv://example.invalid/lugaish",
  CORS_ORIGINS: ["https://lugaish.example"],
};

test("allows local development defaults outside production", () => {
  assert.doesNotThrow(() => validateProductionConfig({}, "development"));
});

test("rejects insecure production configuration", () => {
  assert.throws(() =>
    validateProductionConfig(
      { JWT_SECRET: "short", MONGODB_URI: "", CORS_ORIGINS: [] },
      "production",
    ),
  );
});

test("accepts secure production configuration", () => {
  assert.doesNotThrow(() =>
    validateProductionConfig(validConfig, "production"),
  );
});

test("production rejects invalid CORS origin and placeholder Google project", () => {
  for (const origin of [
    "http://localhost:4174",
    "https://example.invalid/path",
    "https://user:secret@example.invalid",
  ])
    assert.throws(() =>
      validateProductionConfig(
        { ...validConfig, CORS_ORIGINS: [origin] },
        "production",
      ),
    );
  assert.throws(() =>
    validateProductionConfig(
      { ...validConfig, FIREBASE_PROJECT_ID: "your-project" },
      "production",
    ),
  );
});

test("staging production configuration cannot connect to an ordinary database name", () => {
  assert.throws(() =>
    validateProductionConfig(
      { ...validConfig, APP_ENV: "staging" },
      "production",
    ),
  );
  assert.doesNotThrow(() =>
    validateProductionConfig(
      {
        ...validConfig,
        APP_ENV: "staging",
        MONGODB_URI: "mongodb+srv://example.invalid/lugaish_staging",
      },
      "production",
    ),
  );
});

test("production startup requires a matching public frontend, explicit environment and database", () => {
  for (const patch of [
    { APP_ENV: "development" },
    { APP_ENV: undefined },
    { MONGODB_URI: "mongodb+srv://example.invalid/" },
    { MONGODB_URI: "mongodb+srv://example.invalid/lugaish_staging" },
    { FRONTEND_URL: "http://localhost:4174" },
    { FRONTEND_URL: "https://localhost" },
    { FRONTEND_URL: "https://lugaish.example/path" },
    { FRONTEND_URL: "https://other.example" },
    {
      APP_ENV: "staging",
      MONGODB_URI: "mongodb+srv://example.invalid/notstaging",
    },
  ])
    assert.throws(() =>
      validateProductionConfig({ ...validConfig, ...patch }, "production"),
    );
});
