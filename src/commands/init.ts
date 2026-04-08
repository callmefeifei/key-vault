import type { Command } from "commander";
import {
  autoResolveVaultDir,
  vaultExists,
  ensureVaultDir,
  createEmptyStore,
  writeVaultConfig,
  DEFAULT_VAULT_CONFIG,
  type UnlockMode,
} from "../vault-core/index.js";
import { readPasswordWithConfirm, selectOption } from "../prompt.js";

export function registerInit(program: Command): void {
  program
    .command("init")
    .description("初始化凭据库")
    .option("--dir <path>", "指定存储目录")
    .action(async (opts: { dir?: string }) => {
      const vaultDir = opts.dir || autoResolveVaultDir();

      if (vaultExists(vaultDir)) {
        console.error(`Vault 已存在: ${vaultDir}`);
        process.exit(1);
      }

      console.log(`将在 ${vaultDir} 初始化凭据库\n`);

      const password = await readPasswordWithConfirm("设置主密码: ");

      const unlockMode = (await selectOption("解锁模式:", [
        { label: "session — 进程生命周期内缓存", value: "session" },
        { label: "timed — 定时缓存（默认 30 分钟）", value: "timed" },
        { label: "always — 每次都需要输入密码", value: "always" },
      ])) as UnlockMode;

      const config = { ...DEFAULT_VAULT_CONFIG, unlockMode };

      ensureVaultDir(vaultDir);
      writeVaultConfig(vaultDir, config);
      await createEmptyStore(vaultDir, password, config.pbkdf2Iterations);

      console.log("\n凭据库初始化完成");
      console.log(`  存储位置: ${vaultDir}`);
      console.log(`  解锁模式: ${unlockMode}`);
    });
}
