// src/vault/config.ts
import fs from "node:fs";
import { configPath } from "./paths.js";
import { DEFAULT_VAULT_CONFIG, type VaultConfig } from "./types.js";

export function readVaultConfig(vaultDir: string): VaultConfig {
  const p = configPath(vaultDir);
  try {
    if (!fs.existsSync(p)) return { ...DEFAULT_VAULT_CONFIG };
    const raw = fs.readFileSync(p, "utf8");
    const parsed = JSON.parse(raw) as Partial<VaultConfig>;
    return { ...DEFAULT_VAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_VAULT_CONFIG };
  }
}

export function writeVaultConfig(vaultDir: string, config: VaultConfig): void {
  const p = configPath(vaultDir);
  fs.mkdirSync(vaultDir, { recursive: true });
  fs.writeFileSync(p, JSON.stringify(config, null, 2) + "\n", "utf8");
}

export function updateVaultConfig(
  vaultDir: string,
  updates: Partial<VaultConfig>,
): VaultConfig {
  const current = readVaultConfig(vaultDir);
  const merged = { ...current, ...updates };
  writeVaultConfig(vaultDir, merged);
  return merged;
}
