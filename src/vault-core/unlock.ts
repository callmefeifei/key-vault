// src/vault/unlock.ts
import type { UnlockMode } from "./types.js";

type CacheEntry = { password: string; expireAt: number };

const pwCache = new Map<string, CacheEntry>();

export function cachePassword(
  vaultDir: string,
  password: string,
  mode: UnlockMode,
  mins: number,
): void {
  pwCache.set(vaultDir, {
    password,
    expireAt: mode === "timed" ? Date.now() + mins * 60_000 : Infinity,
  });
}

export function getCachedPassword(
  vaultDir: string,
  mode: UnlockMode,
): string | null {
  if (mode === "always") return null;
  const entry = pwCache.get(vaultDir);
  if (!entry) return null;
  if (mode === "timed" && Date.now() > entry.expireAt) {
    pwCache.delete(vaultDir);
    return null;
  }
  return entry.password;
}

export function clearCacheForDir(vaultDir: string): void {
  pwCache.delete(vaultDir);
}

export function clearCache(): void {
  pwCache.clear();
}

let exitRegistered = false;
export function registerExitCleanup(): void {
  if (exitRegistered) return;
  exitRegistered = true;
  process.on("exit", clearCache);
}

/** 从环境变量获取密码 */
export function getEnvPassword(): string | undefined {
  return process.env.KEY_VAULT_PASSWORD || process.env.FFCLAW_VAULT_PASSWORD || undefined;
}
