// src/vault/audit.ts
import fs from "node:fs";
import { auditPath } from "./paths.js";
import path from "node:path";

type AuditEntry = {
  ts: string;
  op: "get" | "list" | "search";
  entryId?: string;
  entryName?: string;
  field?: string | null;
  scope: "global" | "project";
  agentSession?: string;
};

export function writeAuditLog(entry: AuditEntry): void {
  const p = auditPath();
  try {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.appendFileSync(p, JSON.stringify(entry) + "\n", "utf8");
  } catch {
    // Audit log failure is non-fatal
  }
}
