// src/vault/types.ts
export type CredentialType = "aksk" | "token" | "password" | "custom";
export type UnlockMode = "always" | "session" | "timed";
export type VaultScope = "global" | "project";

export type CredentialEntry = {
  id: string;
  name: string;
  type: CredentialType;
  tags: string[];
  fields: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  note?: string;
};

export type VaultConfig = {
  unlockMode: UnlockMode;
  timedCacheMins: number;
  pbkdf2Iterations: number;
  scope: VaultScope;
  agentConfirm: boolean;
  agentConfirmTimeoutSecs: number;
};

export const DEFAULT_VAULT_CONFIG: VaultConfig = {
  unlockMode: "session",
  timedCacheMins: 30,
  pbkdf2Iterations: 600_000,
  scope: "global",
  agentConfirm: false,
  agentConfirmTimeoutSecs: 60,
};

/** Encrypted file layout constants */
export const SALT_LEN = 16;
export const IV_LEN = 12;
export const AUTH_TAG_LEN = 16;
export const KEY_LEN = 32;

/** Template fields per credential type */
export const TYPE_FIELD_TEMPLATES: Record<CredentialType, string[]> = {
  aksk: ["accessKey", "secretKey"],
  token: ["token"],
  password: ["username", "password"],
  custom: [],
};

export type VaultGetResult =
  | { status: "ok"; entry: CredentialEntry }
  | { status: "multiple_matches"; matches: Array<{ id: string; name: string; tags: string[] }> }
  | { status: "not_found"; message: string }
  | { status: "locked"; message: string };
