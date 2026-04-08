// src/vault/__tests__/sensitive.test.ts
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { trackSensitiveValues, containsSensitiveValue, redactSensitiveValues, clearSensitiveValues } from "../sensitive.js";

describe("vault/sensitive", () => {
  beforeEach(() => clearSensitiveValues());

  it("detects tracked value in text", () => {
    trackSensitiveValues({ accessKey: "AKIA123456", secretKey: "shhh" });
    assert.ok(containsSensitiveValue("here is AKIA123456 in text"));
    assert.ok(containsSensitiveValue("shhh"));
    assert.ok(!containsSensitiveValue("nothing here"));
  });

  it("redacts values in text", () => {
    trackSensitiveValues({ token: "super-secret-token-123" });
    const redacted = redactSensitiveValues("my token is super-secret-token-123 ok");
    assert.ok(!redacted.includes("super-secret-token-123"));
    assert.ok(redacted.includes("[REDACTED]"));
  });

  it("ignores short values (< 4 chars) to avoid false positives", () => {
    trackSensitiveValues({ pin: "123" });
    assert.ok(!containsSensitiveValue("123 is here"));
  });
});
