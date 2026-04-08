import type { CredentialEntry } from "./types.js";
export declare function searchEntries(entries: CredentialEntry[], query: string): CredentialEntry[];
export declare function suggestTags(name: string): string[];
export declare function findSimilarNames(entries: CredentialEntry[], name: string, excludeId?: string): string[];
