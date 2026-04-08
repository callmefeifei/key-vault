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
export declare const DEFAULT_VAULT_CONFIG: VaultConfig;
/** Encrypted file layout constants */
export declare const SALT_LEN = 16;
export declare const IV_LEN = 12;
export declare const AUTH_TAG_LEN = 16;
export declare const KEY_LEN = 32;
/** Template fields per credential type */
export declare const TYPE_FIELD_TEMPLATES: Record<CredentialType, string[]>;
export type VaultGetResult = {
    status: "ok";
    entry: CredentialEntry;
} | {
    status: "multiple_matches";
    matches: Array<{
        id: string;
        name: string;
        tags: string[];
    }>;
} | {
    status: "not_found";
    message: string;
} | {
    status: "locked";
    message: string;
};
