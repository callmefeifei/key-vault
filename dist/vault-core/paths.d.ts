export declare function globalVaultDir(): string;
export declare function projectVaultDir(cwd: string): string;
export declare function storePath(vaultDir: string): string;
export declare function configPath(vaultDir: string): string;
export declare function auditPath(): string;
export declare function lockPath(vaultDir: string): string;
export declare function vaultExists(vaultDir: string): boolean;
export declare function resolveVaultDir(scope: "global" | "project", cwd: string): string;
export declare function ensureVaultDir(vaultDir: string): void;
/**
 * 自动探测 vault 存储目录：
 * 1. KEY_VAULT_DIR 环境变量优先
 * 2. 检测 ~/.ffclaw/vault/store.enc（复用 ffclaw）
 * 3. fallback ~/.key-vault/
 */
export declare function autoResolveVaultDir(): string;
