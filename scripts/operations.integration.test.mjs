import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";
test(
  "disconnected API fails readiness, remains live, redacts telemetry and shuts down cleanly",
  { skip: process.env.RUN_OPS_INTEGRATION !== "1" },
  async () => {
    const socket = net.createServer();
    await new Promise((r) => socket.listen(0, "127.0.0.1", r));
    const port = socket.address().port;
    await new Promise((r) => socket.close(r));
    const child = spawn(process.execPath, ["server/src/index.js"], {
      env: {
        ...process.env,
        PORT: String(port),
        NODE_ENV: "development",
        MONGODB_URI: "mongodb://127.0.0.1:1/isolated_unavailable",
        TELEMETRY_ENABLED: "true",
        TRUST_PROXY: "",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (d) => (output += d));
    child.stderr.on("data", (d) => (output += d));
    const exit = new Promise((r) => child.on("exit", r));
    const url = `http://127.0.0.1:${port}`;
    try {
      let running = false;
      for (let i = 0; i < 60; i++) {
        try {
          const r = await fetch(url + "/livez");
          if (r.status === 200) {
            running = true;
            break;
          }
        } catch {}
        await new Promise((r) => setTimeout(r, 100));
      }
      assert.ok(running, "isolated API startup");
      const corsResponse = await fetch(url + "/livez", {
        headers: { Origin: "http://127.0.0.1:4174" },
      });
      assert.ok(corsResponse.headers.get("X-Request-Id"));
      assert.ok(
        corsResponse.headers
          .get("Access-Control-Expose-Headers")
          ?.includes("X-Request-Id"),
      );

      const notReady = await fetch(url + "/readyz");
      assert.equal(notReady.status, 503);
      assert.equal(notReady.headers.get("Cache-Control"), "no-store");
      assert.equal((await fetch(url + "/health")).status, 503);
      const response = await fetch(url + "/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "api_failure",
          token: "NEVER_LOG_THIS_SECRET",
          note: "NEVER_LOG_THIS_SECRET",
        }),
      });
      assert.equal(response.status, 204);
      await new Promise((r) => setTimeout(r, 100));
      assert.ok(output.includes("api_failure"));
      assert.ok(!output.includes("NEVER_LOG_THIS_SECRET"));
      const denied = await fetch(url + "/livez", {
        headers: { Origin: "https://not-allowed.invalid" },
      });
      assert.equal(denied.status, 403);
      assert.ok(denied.headers.get("X-Request-Id"));
      assert.equal(denied.headers.get("X-Content-Type-Options"), "nosniff");
      assert.equal(denied.headers.get("X-Powered-By"), null);
      assert.equal(denied.headers.get("Access-Control-Allow-Origin"), null);
      const preflight = await fetch(url + "/api/auth/me", {
        method: "OPTIONS",
        headers: {
          Origin: "http://127.0.0.1:4174",
          "Access-Control-Request-Method": "GET",
        },
      });
      assert.equal(preflight.status, 204);
      assert.ok(preflight.headers.get("X-Request-Id"));
      assert.equal(preflight.headers.get("X-Frame-Options"), "DENY");
      assert.equal(preflight.headers.get("Cache-Control"), "no-store");
      const invalidBody = await fetch(url + "/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{",
      });
      assert.equal(invalidBody.status, 400);
      assert.deepEqual(await invalidBody.json(), {
        error: "Invalid JSON body",
      });
      assert.ok(invalidBody.headers.get("X-Request-Id"));
      child.kill("SIGTERM");
      let shutdownTimeout;
      try {
        assert.equal(
          await Promise.race([
            exit,
            new Promise((_, reject) => {
              shutdownTimeout = setTimeout(
                () => reject(Error("Shutdown timeout")),
                11000,
              );
            }),
          ]),
          0,
        );
      } finally {
        clearTimeout(shutdownTimeout);
      }
    } finally {
      if (child.exitCode === null) child.kill("SIGKILL");
    }
  },
);
