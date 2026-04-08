import { readVaultConfig, loadEntries, searchEntries, writeAuditLog, trackSensitiveValues, } from "../vault-core/index.js";
import { resolveVault, requirePassword } from "./_helpers.js";
export function registerGet(program) {
    program
        .command("get <query>")
        .description("查询凭据")
        .option("--field <field>", "只返回指定字段")
        .option("--json", "JSON 格式输出")
        .action(async (query, opts) => {
        const { vaultDir } = resolveVault();
        const password = await requirePassword(vaultDir);
        const config = readVaultConfig(vaultDir);
        const entries = await loadEntries(vaultDir, password, config.pbkdf2Iterations);
        const matches = searchEntries(entries, query);
        let result;
        if (matches.length === 0) {
            result = { status: "not_found", message: `未找到匹配 "${query}" 的凭据` };
        }
        else if (matches.length === 1) {
            const entry = matches[0];
            trackSensitiveValues(entry.fields);
            writeAuditLog({
                ts: new Date().toISOString(),
                op: "get",
                entryId: entry.id,
                entryName: entry.name,
                field: opts.field || null,
                scope: config.scope,
            });
            if (opts.field) {
                const value = entry.fields[opts.field];
                if (value === undefined) {
                    console.error(`字段 "${opts.field}" 不存在`);
                    process.exit(1);
                }
                if (opts.json) {
                    console.log(JSON.stringify({ status: "ok", entry: { ...entry, fields: { [opts.field]: value } } }));
                }
                else {
                    console.log(value);
                }
                return;
            }
            result = { status: "ok", entry };
        }
        else {
            result = {
                status: "multiple_matches",
                matches: matches.map((e) => ({ id: e.id, name: e.name, tags: e.tags })),
            };
        }
        if (opts.json) {
            console.log(JSON.stringify(result));
        }
        else {
            if (result.status === "ok") {
                const e = result.entry;
                console.log(`名称: ${e.name}`);
                console.log(`类型: ${e.type}`);
                console.log(`标签: ${e.tags.join(", ") || "无"}`);
                for (const [k, v] of Object.entries(e.fields)) {
                    console.log(`${k}: ${v}`);
                }
                if (e.note)
                    console.log(`备注: ${e.note}`);
            }
            else if (result.status === "multiple_matches") {
                console.log("找到多个匹配项，请指定更精确的名称:");
                for (const m of result.matches) {
                    console.log(`  - ${m.name} [${m.tags.join(", ")}]`);
                }
            }
            else if (result.status === "not_found") {
                console.log(result.message);
            }
        }
    });
}
