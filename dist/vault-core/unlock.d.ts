import type { UnlockMode } from "./types.js";
export declare function cachePassword(vaultDir: string, password: string, mode: UnlockMode, mins: number): void;
export declare function getCachedPassword(vaultDir: string, mode: UnlockMode): string | null;
export declare function clearCacheForDir(vaultDir: string): void;
export declare function clearCache(): void;
export declare function registerExitCleanup(): void;
/** 从环境变量获取密码 */
export declare function getEnvPassword(): string | undefined;
