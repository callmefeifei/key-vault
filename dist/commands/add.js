import crypto from "node:crypto";
import { readVaultConfig, loadEntries, saveEntries, suggestTags, findSimilarNames, TYPE_FIELD_TEMPLATES, } from "../vault-core/index.js";
import { resolveVault, requirePassword } from "./_helpers.js";
import { readLine, readPassword, selectOption, confirm } from "../prompt.js";
const VALID_TYPES = ["aksk", "token", "password", "custom"];
export function registerAdd(program) {
    program
        .command("add [name]")
        .description("添加凭据")
        .option("--type <type>", "凭据类型 (aksk/token/password/custom)")
        .action(async (nameArg, opts) => {
        const { vaultDir } = resolveVault();
        const password = await requirePassword(vaultDir);
        const config = readVaultConfig(vaultDir);
        const entries = await loadEntries(vaultDir, password, config.pbkdf2Iterations);
        const name = nameArg || (await readLine("凭据名称: "));
        if (!name) {
            console.error("名称不能为空");
            process.exit(1);
        }
        const similar = findSimilarNames(entries, name);
        if (similar.length > 0) {
            console.log(`已存在相似凭据: ${similar.join(", ")}`);
            if (!(await confirm("是否继续添加?")))
                return;
        }
        let type;
        if (opts?.type && VALID_TYPES.includes(opts.type)) {
            type = opts.type;
        }
        else {
            type = (await selectOption("凭据类型:", [
                { label: "aksk — Access Key / Secret Key", value: "aksk" },
                { label: "token — API Token", value: "token" },
                { label: "password — 用户名密码", value: "password" },
                { label: "custom — 自定义字段", value: "custom" },
            ]));
        }
        const templateFields = TYPE_FIELD_TEMPLATES[type];
        const fields = {};
        for (const f of templateFields) {
            const value = await readPassword(`${f}: `);
            if (value)
                fields[f] = value;
        }
        if (type === "custom" || templateFields.length === 0) {
            console.log("输入自定义字段（空名称结束）:");
            while (true) {
                const fieldName = await readLine("  字段名: ");
                if (!fieldName)
                    break;
                const fieldValue = await readPassword(`  ${fieldName}: `);
                if (fieldValue)
                    fields[fieldName] = fieldValue;
            }
        }
        if (Object.keys(fields).length === 0) {
            console.error("至少需要一个字段");
            process.exit(1);
        }
        const tagsInput = await readLine(`标签 (逗号分隔，建议: ${suggestTags(name).join(", ")}): `);
        const tags = tagsInput
            ? tagsInput.split(/[,，\s]+/).filter(Boolean)
            : suggestTags(name);
        const note = await readLine("备注 (可选): ");
        const now = new Date().toISOString();
        const entry = {
            id: crypto.randomUUID(),
            name,
            type,
            tags,
            fields,
            createdAt: now,
            updatedAt: now,
            ...(note ? { note } : {}),
        };
        entries.push(entry);
        await saveEntries(vaultDir, entries, password, config.pbkdf2Iterations);
        console.log(`\n凭据已添加: ${name} [${type}]`);
    });
}
