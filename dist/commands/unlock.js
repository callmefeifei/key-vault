import { readVaultConfig, loadEntries, cachePassword, } from "../vault-core/index.js";
import { resolveVault } from "./_helpers.js";
import { readPasswordWithRetry } from "../prompt.js";
export function registerUnlock(program) {
    program
        .command("unlock")
        .description("解锁凭据库")
        .action(async () => {
        const { vaultDir } = resolveVault();
        const config = readVaultConfig(vaultDir);
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
        console.log("凭据库已解锁");
    });
}
