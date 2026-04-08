import type { CredentialEntry } from "./types.js";
export declare function loadEntries(vaultDir: string, password: string, iterations: number): Promise<CredentialEntry[]>;
export declare function saveEntries(vaultDir: string, entries: CredentialEntry[], password: string, iterations: number): Promise<void>;
export declare function createEmptyStore(vaultDir: string, password: string, iterations: number): Promise<void>;
export declare function acquireLock(vaultDir: string): Promise<boolean>;
export declare function releaseLock(vaultDir: string): void;
