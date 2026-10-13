import test from "node:test";
import assert from "node:assert/strict";
import { readiness, trustedProxy, operationalEvent } from "./operations.js";
test("readiness fails for disconnected database or graceful drain", () => {
  assert.equal(readiness(false).status, 503);
  assert.equal(readiness(true, true).status, 503);
  assert.equal(readiness(true).status, 200);
});
test("proxy configuration rejects blanket trust and hop counts", () => {
  for (const v of ["true", "1", "false"]) assert.throws(() => trustedProxy(v));
  assert.equal(trustedProxy(""), false);
  assert.deepEqual(trustedProxy("127.0.0.1,10.0.0.0/8"), [
    "127.0.0.1",
    "10.0.0.0/8",
  ]);
  assert.deepEqual(trustedProxy("loopback,::1,fd00::/8"), [
    "loopback",
    "::1",
    "fd00::/8",
  ]);
  assert.equal(trustedProxy("  "), false);
  for (const value of [
    "0.0.0.0/0",
    "::/0",
    "not-a-network",
    "10.0.0.1/33",
    "::1/129",
    "10.0.0.1/garbage",
    "10.0.0.1/24/extra",
  ]) {
    assert.throws(() => trustedProxy(value), value);
  }
});
test("operational telemetry drops unrecognized payloads and never extracts sensitive data", () => {
  assert.equal(
    operationalEvent({
      event: "api_failure",
      token: "secret",
      message: "private note",
    }),
    "api_failure",
  );
  assert.equal(operationalEvent({ event: "private note" }), null);
  assert.equal(operationalEvent(null), null);
});
