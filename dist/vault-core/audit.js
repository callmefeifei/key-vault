// src/vault/audit.ts
import fs from "node:fs";
import { auditPath } from "./paths.js";
import path from "node:path";
export function writeAuditLog(entry) {
    const p = auditPath();
    try {
        fs.mkdirSync(path.dirname(p), { recursive: true });
        fs.appendFileSync(p, JSON.stringify(entry) + "\n", "utf8");
    }
    catch {
        // Audit log failure is non-fatal
    }
}
