import type { Command } from "commander";
import { clearCache } from "../vault-core/index.js";

export function registerLock(program: Command): void {
  program
    .command("lock")
    .description("锁定凭据库（清除缓存）")
    .action(() => {
      clearCache();
      console.log("凭据库已锁定");
    });
}
