import { type VaultConfig } from "./types.js";
export declare function readVaultConfig(vaultDir: string): VaultConfig;
export declare function writeVaultConfig(vaultDir: string, config: VaultConfig): void;
export declare function updateVaultConfig(vaultDir: string, updates: Partial<VaultConfig>): VaultConfig;
