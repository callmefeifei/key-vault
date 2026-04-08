// src/vault/__tests__/unlock.test.ts
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { cachePassword, getCachedPassword, clearCache, clearCacheForDir } from "../unlock.js";

describe("vault/unlock", () => {
  beforeEach(() => clearCache());

  it("session mode: caches password indefinitely", () => {
    cachePassword("/global", "my-secret", "session", 0);
    assert.strictEqual(getCachedPassword("/global", "session"), "my-secret");
  });

  it("always mode: never returns cached password", () => {
    cachePassword("/global", "my-secret", "always", 0);
    assert.strictEqual(getCachedPassword("/global", "always"), null);
  });

  it("timed mode: returns password before expiry", () => {
    cachePassword("/global", "my-secret", "timed", 30);
    assert.strictEqual(getCachedPassword("/global", "timed"), "my-secret");
  });

  it("scope isolation: different dirs have independent caches", () => {
    cachePassword("/global", "pw-global", "session", 0);
    cachePassword("/project", "pw-project", "session", 0);
    assert.strictEqual(getCachedPassword("/global", "session"), "pw-global");
    assert.strictEqual(getCachedPassword("/project", "session"), "pw-project");
  });

  it("clearCacheForDir removes only target", () => {
    cachePassword("/global", "pw1", "session", 0);
    cachePassword("/project", "pw2", "session", 0);
    clearCacheForDir("/global");
    assert.strictEqual(getCachedPassword("/global", "session"), null);
    assert.strictEqual(getCachedPassword("/project", "session"), "pw2");
  });

  it("clearCache removes all entries", () => {
    cachePassword("/global", "pw1", "session", 0);
    cachePassword("/project", "pw2", "session", 0);
    clearCache();
    assert.strictEqual(getCachedPassword("/global", "session"), null);
    assert.strictEqual(getCachedPassword("/project", "session"), null);
  });
});
