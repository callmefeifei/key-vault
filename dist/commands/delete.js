import { readVaultConfig, loadEntries, saveEntries, searchEntries, } from "../vault-core/index.js";
import { resolveVault, requirePassword } from "./_helpers.js";
import { confirm } from "../prompt.js";
export function registerDelete(program) {
    program
        .command("delete <nameOrId>")
        .description("删除凭据")
        .option("-f, --force", "跳过确认")
        .action(async (nameOrId, opts) => {
        const { vaultDir } = resolveVault();
        const password = await requirePassword(vaultDir);
        const config = readVaultConfig(vaultDir);
        const entries = await loadEntries(vaultDir, password, config.pbkdf2Iterations);
        const matches = searchEntries(entries, nameOrId);
        if (matches.length === 0) {
            console.error(`未找到凭据: ${nameOrId}`);
            process.exit(1);
        }
        if (matches.length > 1) {
            console.error("匹配多个凭据，请指定更精确的名称:");
            for (const m of matches)
                console.error(`  - ${m.name} (${m.id})`);
            process.exit(1);
        }
        const entry = matches[0];
        if (!opts.force) {
            const ok = await confirm(`确认删除凭据 "${entry.name}" [${entry.type}]?`);
            if (!ok) {
                console.log("已取消");
                return;
            }
        }
        const filtered = entries.filter((e) => e.id !== entry.id);
        await saveEntries(vaultDir, filtered, password, config.pbkdf2Iterations);
        console.log(`凭据已删除: ${entry.name}`);
    });
}
