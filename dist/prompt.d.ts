export declare function readPassword(prompt: string): Promise<string>;
export declare function readPasswordWithConfirm(prompt: string): Promise<string>;
export declare function readPasswordWithRetry(prompt: string, verify: (pw: string) => Promise<boolean>, maxRetries?: number): Promise<string>;
export declare function readLine(prompt: string): Promise<string>;
export declare function selectOption(prompt: string, options: Array<{
    label: string;
    value: string;
}>): Promise<string>;
export declare function confirm(prompt: string): Promise<boolean>;
