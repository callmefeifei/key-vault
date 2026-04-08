// src/vault/__tests__/search.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { searchEntries, suggestTags } from "../search.js";
import type { CredentialEntry } from "../types.js";

const ENTRIES: CredentialEntry[] = [
  { id: "1", name: "阿里云-SLS-prod", type: "aksk", tags: ["aliyun", "sls", "prod"], fields: {}, createdAt: "", updatedAt: "" },
  { id: "2", name: "阿里云-OSS-prod", type: "aksk", tags: ["aliyun", "oss", "prod"], fields: {}, createdAt: "", updatedAt: "" },
  { id: "3", name: "AWS-S3-test", type: "aksk", tags: ["aws", "s3", "test"], fields: {}, createdAt: "", updatedAt: "" },
  { id: "4", name: "GitHub-Token", type: "token", tags: ["github", "ci"], fields: {}, createdAt: "", updatedAt: "" },
];

describe("vault/search", () => {
  it("exact name match returns single result", () => {
    const r = searchEntries(ENTRIES, "阿里云-SLS-prod");
    assert.strictEqual(r.length, 1);
    assert.strictEqual(r[0].id, "1");
  });

  it("tag-based search returns multiple matches", () => {
    const r = searchEntries(ENTRIES, "aliyun prod");
    assert.strictEqual(r.length, 2);
  });

  it("type filter works", () => {
    const r = searchEntries(ENTRIES, "token");
    assert.strictEqual(r.length, 1);
    assert.strictEqual(r[0].id, "4");
  });

  it("no match returns empty", () => {
    const r = searchEntries(ENTRIES, "azure");
    assert.strictEqual(r.length, 0);
  });

  it("id exact match", () => {
    const r = searchEntries(ENTRIES, "3");
    assert.strictEqual(r.length, 1);
    assert.strictEqual(r[0].name, "AWS-S3-test");
  });

  it("suggestTags extracts from name", () => {
    const tags = suggestTags("阿里云-SLS-prod");
    assert.ok(tags.includes("sls"));
    assert.ok(tags.includes("prod"));
  });
});
