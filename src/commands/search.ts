import type { Command } from "commander";
import {
  readVaultConfig,
  loadEntries,
  searchEntries,
  writeAuditLog,
} from "../vault-core/index.js";
import { resolveVault, requirePassword } from "./_helpers.js";

export function registerSearch(program: Command): void {
  program
    .command("search <keyword>")
    .description("模糊搜索凭据")
    .option("--json", "JSON 格式输出")
    .action(async (keyword: string, opts: { json?: boolean }) => {
      const { vaultDir } = resolveVault();
      const password = await requirePassword(vaultDir);
      const config = readVaultConfig(vaultDir);
      const entries = await loadEntries(
        vaultDir,
        password,
        config.pbkdf2Iterations,
      );

      const matches = searchEntries(entries, keyword);

      writeAuditLog({
        ts: new Date().toISOString(),
        op: "search",
        scope: config.scope,
      });

      const safe = matches.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        tags: e.tags,
        fields: Object.keys(e.fields),
        note: e.note,
      }));

      if (opts.json) {
        console.log(JSON.stringify({ status: "ok", matches: safe }));
      } else {
        if (safe.length === 0) {
          console.log(`未找到匹配 "${keyword}" 的凭据`);
          return;
        }
        for (const e of safe) {
          console.log(
            `  ${e.name}  [${e.type}]  标签: ${e.tags.join(", ") || "无"}`,
          );
        }
        console.log(`\n共 ${safe.length} 条匹配`);
      }
    });
}
