import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

function appEnvironment(nodeEnv, appEnv) {
  const env = { ...process.env, NODE_ENV: nodeEnv, DOTENV_CONFIG_QUIET: "true" };
  delete env.APP_ENV;
  if (appEnv !== undefined) env.APP_ENV = appEnv;
  return execFileSync(process.execPath, [
    "--input-type=module", "-e",
    "import config from './src/config.js'; process.stdout.write(JSON.stringify(config.APP_ENV));",
  ], { cwd: new URL("../", import.meta.url), env, encoding: "utf8" }).trim();
}

test("production startup infers APP_ENV when the host only sets NODE_ENV", () => {
  assert.equal(appEnvironment("production"), '"production"');
});

test("explicit staging and invalid environments remain subject to validation", () => {
  assert.equal(appEnvironment("production", "staging"), '"staging"');
  assert.equal(appEnvironment("production", "invalid"), '"invalid"');
});

test("local development keeps its development default", () => {
  assert.equal(appEnvironment("development"), '"development"');
});
