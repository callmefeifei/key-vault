// src/vault/paths.ts
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const VAULT_DIR = "vault";
const STORE_FILE = "store.enc";
const CONFIG_FILE = "config.json";
const AUDIT_FILE = "audit.log";

export function globalVaultDir(): string {
  return path.join(os.homedir(), ".ffclaw", VAULT_DIR);
}

export function projectVaultDir(cwd: string): string {
  return path.join(cwd, ".ffclaw", VAULT_DIR);
}

export function storePath(vaultDir: string): string {
  return path.join(vaultDir, STORE_FILE);
}

export function configPath(vaultDir: string): string {
  return path.join(vaultDir, CONFIG_FILE);
}

export function auditPath(): string {
  return path.join(globalVaultDir(), AUDIT_FILE);
}

export function lockPath(vaultDir: string): string {
  return path.join(vaultDir, `${STORE_FILE}.lock`);
}

export function vaultExists(vaultDir: string): boolean {
  return fs.existsSync(storePath(vaultDir));
}

export function resolveVaultDir(scope: "global" | "project", cwd: string): string {
  return scope === "project" ? projectVaultDir(cwd) : globalVaultDir();
}

export function ensureVaultDir(vaultDir: string): void {
  fs.mkdirSync(vaultDir, { recursive: true });
}

/**
 * 自动探测 vault 存储目录：
 * 1. KEY_VAULT_DIR 环境变量优先
 * 2. 检测 ~/.ffclaw/vault/store.enc（复用 ffclaw）
 * 3. fallback ~/.key-vault/
 */
export function autoResolveVaultDir(): string {
  if (process.env.KEY_VAULT_DIR) return process.env.KEY_VAULT_DIR;
  const ffclawDir = globalVaultDir();
  if (fs.existsSync(storePath(ffclawDir))) return ffclawDir;
  return path.join(os.homedir(), ".key-vault");
}
