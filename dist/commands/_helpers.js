import { autoResolveVaultDir, vaultExists, readVaultConfig, getCachedPassword, getEnvPassword, cachePassword, loadEntries, registerExitCleanup, } from "../vault-core/index.js";
import { readPasswordWithRetry } from "../prompt.js";
registerExitCleanup();
export function resolveVault() {
    const vaultDir = autoResolveVaultDir();
    if (!vaultExists(vaultDir)) {
        console.error("Vault 不存在，请先运行 key-vault init");
        process.exit(1);
    }
    return { vaultDir };
}
export async function requirePassword(vaultDir) {
    const config = readVaultConfig(vaultDir);
    const cached = getCachedPassword(vaultDir, config.unlockMode);
    if (cached)
        return cached;
    const envPw = getEnvPassword();
    if (envPw) {
        try {
            await loadEntries(vaultDir, envPw, config.pbkdf2Iterations);
            cachePassword(vaultDir, envPw, config.unlockMode, config.timedCacheMins);
            return envPw;
        }
        catch {
            console.error("环境变量中的密码不正确");
        }
    }
    if (!process.stdin.isTTY) {
        console.error("Vault 未解锁。请设置 KEY_VAULT_PASSWORD 环境变量");
        process.exit(1);
    }
    const pw = await readPasswordWithRetry("主密码: ", async (pw) => {
        try {
            await loadEntries(vaultDir, pw, config.pbkdf2Iterations);
            return true;
        }
        catch {
            return false;
        }
    });
    cachePassword(vaultDir, pw, config.unlockMode, config.timedCacheMins);
    return pw;
}
