import { autoResolveVaultDir, vaultExists, readVaultConfig, getCachedPassword, getEnvPassword, loadEntries, } from "../vault-core/index.js";
export function registerStatus(program) {
    program
        .command("status")
        .description("显示凭据库状态")
        .action(async () => {
        const vaultDir = autoResolveVaultDir();
        if (!vaultExists(vaultDir)) {
            console.log("状态: 未初始化");
            console.log(`路径: ${vaultDir}`);
            console.log("\n运行 key-vault init 初始化凭据库");
            return;
        }
        const config = readVaultConfig(vaultDir);
        const cached = getCachedPassword(vaultDir, config.unlockMode);
        const envPw = getEnvPassword();
        const unlocked = !!cached || !!envPw;
        let entryCount = "?";
        if (unlocked) {
            const pw = cached || envPw;
            try {
                const entries = await loadEntries(vaultDir, pw, config.pbkdf2Iterations);
                entryCount = String(entries.length);
            }
            catch {
                /* ignore */
            }
        }
        console.log("状态: 已初始化");
        console.log(`路径: ${vaultDir}`);
        console.log(`解锁模式: ${config.unlockMode}`);
        console.log(`已解锁: ${unlocked ? "是" : "否"}`);
        console.log(`凭据数量: ${entryCount}`);
    });
}
