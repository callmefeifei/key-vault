const pwCache = new Map();
export function cachePassword(vaultDir, password, mode, mins) {
    pwCache.set(vaultDir, {
        password,
        expireAt: mode === "timed" ? Date.now() + mins * 60_000 : Infinity,
    });
}
export function getCachedPassword(vaultDir, mode) {
    if (mode === "always")
        return null;
    const entry = pwCache.get(vaultDir);
    if (!entry)
        return null;
    if (mode === "timed" && Date.now() > entry.expireAt) {
        pwCache.delete(vaultDir);
        return null;
    }
    return entry.password;
}
export function clearCacheForDir(vaultDir) {
    pwCache.delete(vaultDir);
}
export function clearCache() {
    pwCache.clear();
}
let exitRegistered = false;
export function registerExitCleanup() {
    if (exitRegistered)
        return;
    exitRegistered = true;
    process.on("exit", clearCache);
}
/** 从环境变量获取密码 */
export function getEnvPassword() {
    return process.env.KEY_VAULT_PASSWORD || process.env.FFCLAW_VAULT_PASSWORD || undefined;
}
