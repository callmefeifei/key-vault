import crypto from "node:crypto";
import type { Command } from "commander";
import {
  readVaultConfig,
  loadEntries,
  saveEntries,
  suggestTags,
  findSimilarNames,
  TYPE_FIELD_TEMPLATES,
  type CredentialType,
  type CredentialEntry,
} from "../vault-core/index.js";
import { resolveVault, requirePassword } from "./_helpers.js";
import { readLine, readPassword, selectOption, confirm } from "../prompt.js";

const VALID_TYPES: CredentialType[] = ["aksk", "token", "password", "custom"];

export function registerAdd(program: Command): void {
  program
    .command("add [name]")
    .description("添加凭据")
    .option("--type <type>", "凭据类型 (aksk/token/password/custom)")
    .option("--field <fields...>", "非交互模式字段 key=value（可多个）")
    .option("--tags <tags>", "标签（逗号分隔）")
    .option("--note <note>", "备注")
    .action(async (nameArg?: string, opts?: { type?: string; field?: string[]; tags?: string; note?: string }) => {
      const { vaultDir } = resolveVault();
      const password = await requirePassword(vaultDir);
      const config = readVaultConfig(vaultDir);
      const entries = await loadEntries(
        vaultDir,
        password,
        config.pbkdf2Iterations,
      );

      const name = nameArg || (process.stdin.isTTY ? await readLine("凭据名称: ") : "");
      if (!name) {
        console.error("名称不能为空");
        process.exit(1);
      }

      // Non-interactive mode: --field key=value
      if (opts?.field && opts.field.length > 0) {
        const type: CredentialType = (opts.type && VALID_TYPES.includes(opts.type as CredentialType))
          ? opts.type as CredentialType : "custom";

        const fields: Record<string, string> = {};
        for (const f of opts.field) {
          const eqIdx = f.indexOf("=");
          if (eqIdx === -1) {
            console.error(`字段格式错误: ${f}（应为 key=value）`);
            process.exit(1);
          }
          fields[f.slice(0, eqIdx)] = f.slice(eqIdx + 1);
        }

        const tags = opts.tags
          ? opts.tags.split(/[,，\s]+/).filter(Boolean)
          : suggestTags(name);

        const now = new Date().toISOString();
        const entry: CredentialEntry = {
          id: crypto.randomUUID(),
          name,
          type,
          tags,
          fields,
          createdAt: now,
          updatedAt: now,
          ...(opts.note ? { note: opts.note } : {}),
        };

        entries.push(entry);
        await saveEntries(vaultDir, entries, password, config.pbkdf2Iterations);
        console.log(`凭据已添加: ${name} [${type}]`);
        return;
      }

      // Interactive mode
      const similar = findSimilarNames(entries, name);
      if (similar.length > 0) {
        console.log(`已存在相似凭据: ${similar.join(", ")}`);
        if (!(await confirm("是否继续添加?"))) return;
      }

      let type: CredentialType;
      if (opts?.type && VALID_TYPES.includes(opts.type as CredentialType)) {
        type = opts.type as CredentialType;
      } else {
        type = (await selectOption("凭据类型:", [
          { label: "aksk — Access Key / Secret Key", value: "aksk" },
          { label: "token — API Token", value: "token" },
          { label: "password — 用户名密码", value: "password" },
          { label: "custom — 自定义字段", value: "custom" },
        ])) as CredentialType;
      }

      const templateFields = TYPE_FIELD_TEMPLATES[type];
      const fields: Record<string, string> = {};

      for (const f of templateFields) {
        const value = await readPassword(`${f}: `);
        if (value) fields[f] = value;
      }

      if (type === "custom" || templateFields.length === 0) {
        console.log("输入自定义字段（空名称结束）:");
        while (true) {
          const fieldName = await readLine("  字段名: ");
          if (!fieldName) break;
          const fieldValue = await readPassword(`  ${fieldName}: `);
          if (fieldValue) fields[fieldName] = fieldValue;
        }
      }

      if (Object.keys(fields).length === 0) {
        console.error("至少需要一个字段");
        process.exit(1);
      }

      const tagsInput = await readLine(
        `标签 (逗号分隔，建议: ${suggestTags(name).join(", ")}): `,
      );
      const tags = tagsInput
        ? tagsInput.split(/[,，\s]+/).filter(Boolean)
        : suggestTags(name);

      const note = await readLine("备注 (可选): ");

      const now = new Date().toISOString();
      const entry: CredentialEntry = {
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
