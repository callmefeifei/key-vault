import { clearCache } from "../vault-core/index.js";
export function registerLock(program) {
    program
        .command("lock")
        .description("锁定凭据库（清除缓存）")
        .action(() => {
        clearCache();
        console.log("凭据库已锁定");
    });
}
