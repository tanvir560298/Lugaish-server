import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import config from "../config.js";
import {
  authMiddleware,
  optionalAuthMiddleware,
  validTokenSubject,
} from "./auth.js";

test("signed token subjects must be scalar Mongo ids and use HS256", () => {
  for (const userId of [null, "", "not-an-id", { $ne: null }, ["123"], 123]) {
    assert.equal(validTokenSubject({ userId }), false);
    const req = {
      headers: {
        authorization: "Bearer " + jwt.sign({ userId }, config.JWT_SECRET),
      },
    };
    const res = {
      status(code) {
        this.code = code;
        return this;
      },
      json() {},
    };
    let next = false;
    authMiddleware(req, res, () => {
      next = true;
    });
    assert.equal(res.code, 401);
    assert.equal(next, false);
    optionalAuthMiddleware(req, res, () => {});
    assert.equal(req.userId, undefined);
  }
  const req = {
    headers: {
      authorization:
        "Bearer " +
        jwt.sign({ userId: "0123456789abcdef01234567" }, config.JWT_SECRET, {
          algorithm: "HS512",
        }),
    },
  };
  const res = {
    status(code) {
      this.code = code;
      return this;
    },
    json() {},
  };
  authMiddleware(req, res, () => {
    throw Error("Unexpected authentication");
  });
  assert.equal(res.code, 401);
});
