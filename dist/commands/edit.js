import { readVaultConfig, loadEntries, saveEntries, searchEntries, } from "../vault-core/index.js";
import { resolveVault, requirePassword } from "./_helpers.js";
import { readLine, readPassword } from "../prompt.js";
export function registerEdit(program) {
    program
        .command("edit <nameOrId>")
        .description("编辑凭据")
        .action(async (nameOrId) => {
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
        const idx = entries.findIndex((e) => e.id === entry.id);
        console.log(`编辑凭据: ${entry.name} [${entry.type}]`);
        console.log("当前字段 (留空保持不变):\n");
        for (const [k, _v] of Object.entries(entry.fields)) {
            const newVal = await readPassword(`${k} [已设置]: `);
            if (newVal)
                entry.fields[k] = newVal;
        }
        console.log("\n添加新字段（空名称结束）:");
        while (true) {
            const fieldName = await readLine("  字段名: ");
            if (!fieldName)
                break;
            const fieldValue = await readPassword(`  ${fieldName}: `);
            if (fieldValue)
                entry.fields[fieldName] = fieldValue;
        }
        const tagsInput = await readLine(`标签 (当前: ${entry.tags.join(", ")}, 留空保持不变): `);
        if (tagsInput) {
            entry.tags = tagsInput.split(/[,，\s]+/).filter(Boolean);
        }
        const note = await readLine(`备注 (当前: ${entry.note || "无"}, 留空保持不变): `);
        if (note)
            entry.note = note;
        entry.updatedAt = new Date().toISOString();
        entries[idx] = entry;
        await saveEntries(vaultDir, entries, password, config.pbkdf2Iterations);
        console.log(`\n凭据已更新: ${entry.name}`);
    });
}
