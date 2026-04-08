export const DEFAULT_VAULT_CONFIG = {
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
export const TYPE_FIELD_TEMPLATES = {
    aksk: ["accessKey", "secretKey"],
    token: ["token"],
    password: ["username", "password"],
    custom: [],
};
