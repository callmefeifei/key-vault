// src/vault/crypto.ts
import crypto from "node:crypto";
import { promisify } from "node:util";
import { SALT_LEN, IV_LEN, AUTH_TAG_LEN, KEY_LEN } from "./types.js";

const pbkdf2Async = promisify(crypto.pbkdf2);

export async function deriveKey(
  password: string,
  salt: Buffer,
  iterations: number,
): Promise<Buffer> {
  return pbkdf2Async(password, salt, iterations, KEY_LEN, "sha512");
}

export async function encrypt(
  plaintext: string,
  password: string,
  iterations: number,
): Promise<Buffer> {
  const salt = crypto.randomBytes(SALT_LEN);
  const iv = crypto.randomBytes(IV_LEN);
  const key = await deriveKey(password, salt, iterations);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  key.fill(0);

  return Buffer.concat([salt, iv, encrypted, authTag]);
}

export async function decrypt(
  data: Buffer,
  password: string,
  iterations: number,
): Promise<string> {
  const minLen = SALT_LEN + IV_LEN + AUTH_TAG_LEN + 1;
  if (data.length < minLen) {
    throw new Error("Vault decrypt: data too short, file may be corrupted");
  }

  const salt = data.subarray(0, SALT_LEN);
  const iv = data.subarray(SALT_LEN, SALT_LEN + IV_LEN);
  const authTag = data.subarray(data.length - AUTH_TAG_LEN);
  const ciphertext = data.subarray(SALT_LEN + IV_LEN, data.length - AUTH_TAG_LEN);

  const key = await deriveKey(password, salt, iterations);

  try {
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    return decrypted.toString("utf8");
  } catch {
    throw new Error("Vault decrypt failed: wrong password or corrupted data");
  } finally {
    key.fill(0);
  }
}
