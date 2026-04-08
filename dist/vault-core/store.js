// src/vault/store.ts
import fs from "node:fs";
import { encrypt, decrypt } from "./crypto.js";
import { storePath, lockPath, ensureVaultDir } from "./paths.js";
export async function loadEntries(vaultDir, password, iterations) {
    const sp = storePath(vaultDir);
    if (!fs.existsSync(sp))
        return [];
    const data = fs.readFileSync(sp);
    const json = await decrypt(data, password, iterations);
    return JSON.parse(json);
}
export async function saveEntries(vaultDir, entries, password, iterations) {
    ensureVaultDir(vaultDir);
    if (!(await acquireLock(vaultDir))) {
        throw new Error("Vault store is locked by another process. Try again later.");
    }
    try {
        const json = JSON.stringify(entries);
        const encrypted = await encrypt(json, password, iterations);
        fs.writeFileSync(storePath(vaultDir), encrypted);
    }
    finally {
        releaseLock(vaultDir);
    }
}
export async function createEmptyStore(vaultDir, password, iterations) {
    await saveEntries(vaultDir, [], password, iterations);
}
const MAX_LOCK_RETRIES = 5;
const LOCK_RETRY_MS = 100;
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function acquireLock(vaultDir) {
    const lp = lockPath(vaultDir);
    for (let i = 0; i < MAX_LOCK_RETRIES; i++) {
        try {
            fs.writeFileSync(lp, `${process.pid}\n`, { flag: "wx" });
            return true;
        }
        catch {
            try {
                const raw = fs.readFileSync(lp, "utf8").trim();
                const pid = parseInt(raw, 10);
                if (Number.isFinite(pid) && pid > 0) {
                    try {
                        process.kill(pid, 0);
                    }
                    catch {
                        fs.unlinkSync(lp);
                        continue;
                    }
                }
            }
            catch {
                try {
                    fs.unlinkSync(lp);
                }
                catch { /* ignore */ }
                continue;
            }
            await delay(LOCK_RETRY_MS);
        }
    }
    return false;
}
export function releaseLock(vaultDir) {
    try {
        fs.unlinkSync(lockPath(vaultDir));
    }
    catch {
        /* ignore */
    }
}
