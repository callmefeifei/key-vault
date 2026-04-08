export declare function resolveVault(): {
    vaultDir: string;
};
export declare function requirePassword(vaultDir: string): Promise<string>;
