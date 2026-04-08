export declare function deriveKey(password: string, salt: Buffer, iterations: number): Promise<Buffer>;
export declare function encrypt(plaintext: string, password: string, iterations: number): Promise<Buffer>;
export declare function decrypt(data: Buffer, password: string, iterations: number): Promise<string>;
