import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadEntries, saveEntries, acquireLock, releaseLock } from "../store.js";
describe("vault/store", () => {
    let tmpDir;
    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vault-test-"));
    });
    afterEach(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });
    it("save then load roundtrip", async () => {
        const entries = [
            {
                id: "test-1",
                name: "AWS-prod",
                type: "aksk",
                tags: ["aws", "prod"],
                fields: { accessKey: "AKIA...", secretKey: "secret" },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];
        await saveEntries(tmpDir, entries, "my-password", 1000);
        const loaded = await loadEntries(tmpDir, "my-password", 1000);
        assert.strictEqual(loaded.length, 1);
        assert.strictEqual(loaded[0].name, "AWS-prod");
        assert.strictEqual(loaded[0].fields.accessKey, "AKIA...");
    });
    it("load with wrong password throws", async () => {
        await saveEntries(tmpDir, [], "correct", 1000);
        await assert.rejects(() => loadEntries(tmpDir, "wrong", 1000));
    });
    it("load from nonexistent store returns empty array", async () => {
        const entries = await loadEntries(tmpDir, "pw", 1000);
        assert.strictEqual(entries.length, 0);
    });
    it("lockfile acquire/release", async () => {
        const acquired = await acquireLock(tmpDir);
        assert.ok(acquired);
        releaseLock(tmpDir);
        const again = await acquireLock(tmpDir);
        assert.ok(again);
        releaseLock(tmpDir);
    });
});
