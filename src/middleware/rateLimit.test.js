import test from 'node:test';
import assert from 'node:assert/strict';
import { createRateLimit } from './rateLimit.js';

function response() {
  return {
    headers: {},
    statusCode: 200,
    set(name, value) { this.headers[name] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('rate limiter blocks requests above the configured maximum', () => {
  const limit = createRateLimit({ windowMs: 60_000, max: 2 });
  const req = { ip: '127.0.0.1' };
  let allowed = 0;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const res = response();
    limit(req, res, () => { allowed += 1; });
    if (attempt === 2) {
      assert.equal(res.statusCode, 429);
      assert.equal(res.headers['Retry-After'], '60');
    }
  }

  assert.equal(allowed, 2);
});
