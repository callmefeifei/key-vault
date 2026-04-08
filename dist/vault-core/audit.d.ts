type AuditEntry = {
    ts: string;
    op: "get" | "list" | "search";
    entryId?: string;
    entryName?: string;
    field?: string | null;
    scope: "global" | "project";
    agentSession?: string;
};
export declare function writeAuditLog(entry: AuditEntry): void;
export {};
