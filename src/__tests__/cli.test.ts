import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const CLI = path.resolve(import.meta.dirname, "../../bin/key-vault.mjs");
function run(args: string[], env: Record<string, string> = {}): string {
  return execFileSync("node", [CLI, ...args], {
    encoding: "utf8",
    env: { ...process.env, ...env },
    timeout: 10000,
  });
}

describe("key-vault CLI", () => {
  let tmpDir: string;
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "kv-test-"));
  });
  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("--help shows all commands", () => {
    const out = run(["--help"]);
    assert.ok(out.includes("init"));
    assert.ok(out.includes("get"));
    assert.ok(out.includes("skill"));
  });

  it("status shows uninitialized for empty dir", () => {
    const out = run(["status"], { KEY_VAULT_DIR: tmpDir });
    assert.ok(out.includes("未初始化"));
  });

  it("skill outputs prompt content", () => {
    const out = run(["skill"]);
    assert.ok(out.includes("key-vault get"));
    assert.ok(out.includes("安全规则"));
  });

  it("skill --markdown outputs integration guide", () => {
    const out = run(["skill", "--markdown"]);
    assert.ok(out.includes("集成指南"));
  });
});
