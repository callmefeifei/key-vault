// src/vault/__tests__/crypto.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deriveKey, encrypt, decrypt } from "../crypto.js";
import { SALT_LEN, IV_LEN, AUTH_TAG_LEN } from "../types.js";
import crypto from "node:crypto";

describe("vault/crypto", () => {
  it("deriveKey produces 32-byte buffer", async () => {
    const salt = crypto.randomBytes(SALT_LEN);
    const key = await deriveKey("test-password", salt, 1000);
    assert.strictEqual(key.length, 32);
  });

  it("encrypt/decrypt roundtrip", async () => {
    const plaintext = JSON.stringify([{ id: "1", name: "test" }]);
    const password = "my-secret";
    const encrypted = await encrypt(plaintext, password, 1000);
    assert.ok(encrypted.length > SALT_LEN + IV_LEN + AUTH_TAG_LEN);
    const decrypted = await decrypt(encrypted, password, 1000);
    assert.strictEqual(decrypted, plaintext);
  });

  it("decrypt with wrong password throws", async () => {
    const encrypted = await encrypt("secret", "correct", 1000);
    await assert.rejects(() => decrypt(encrypted, "wrong", 1000), /decrypt/i);
  });

  it("each encrypt produces different output (random salt+IV)", async () => {
    const a = await encrypt("same", "pw", 1000);
    const b = await encrypt("same", "pw", 1000);
    assert.ok(!a.equals(b));
  });
});
