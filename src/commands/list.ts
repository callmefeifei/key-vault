import type { Command } from "commander";
import {
  readVaultConfig,
  loadEntries,
  writeAuditLog,
} from "../vault-core/index.js";
import { resolveVault, requirePassword } from "./_helpers.js";

export function registerList(program: Command): void {
  program
    .command("list")
    .description("列出所有凭据（不含敏感值）")
    .option("--json", "JSON 格式输出")
    .action(async (opts: { json?: boolean }) => {
      const { vaultDir } = resolveVault();
      const password = await requirePassword(vaultDir);
      const config = readVaultConfig(vaultDir);
      const entries = await loadEntries(
        vaultDir,
        password,
        config.pbkdf2Iterations,
      );

      writeAuditLog({
        ts: new Date().toISOString(),
        op: "list",
        scope: config.scope,
      });

      const safe = entries.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        tags: e.tags,
        fields: Object.keys(e.fields),
        note: e.note,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      }));

      if (opts.json) {
        console.log(JSON.stringify({ status: "ok", entries: safe }));
      } else {
        if (safe.length === 0) {
          console.log("凭据库为空");
          return;
        }
        for (const e of safe) {
          console.log(
            `  ${e.name}  [${e.type}]  标签: ${e.tags.join(", ") || "无"}  字段: ${e.fields.join(", ")}`,
          );
        }
        console.log(`\n共 ${safe.length} 条凭据`);
      }
    });
}
