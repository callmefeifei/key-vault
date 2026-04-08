import readline from "node:readline";
export function readPassword(prompt) {
    return new Promise((resolve, reject) => {
        if (!process.stdin.isTTY) {
            const rl = readline.createInterface({ input: process.stdin });
            process.stderr.write(prompt);
            rl.once("line", (line) => {
                rl.close();
                resolve(line);
            });
            rl.once("error", reject);
            return;
        }
        process.stderr.write(prompt);
        const buf = [];
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding("utf8");
        const onData = (ch) => {
            const code = ch.charCodeAt(0);
            if (code === 3) {
                process.stderr.write("\n");
                cleanup();
                reject(new Error("Cancelled"));
                return;
            }
            if (ch === "\r" || ch === "\n") {
                process.stderr.write("\n");
                cleanup();
                resolve(buf.join(""));
                return;
            }
            if (code === 127 || code === 8) {
                if (buf.length > 0) {
                    buf.pop();
                    process.stderr.write("\b \b");
                }
                return;
            }
            if (code >= 32) {
                buf.push(ch);
                process.stderr.write("*");
            }
        };
        const cleanup = () => {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            process.stdin.removeListener("data", onData);
        };
        process.stdin.on("data", onData);
    });
}
export async function readPasswordWithConfirm(prompt) {
    const pw1 = await readPassword(prompt);
    if (!pw1)
        throw new Error("Password cannot be empty");
    const pw2 = await readPassword("确认密码: ");
    if (pw1 !== pw2)
        throw new Error("两次密码不一致");
    return pw1;
}
export async function readPasswordWithRetry(prompt, verify, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        const pw = await readPassword(prompt);
        if (await verify(pw))
            return pw;
        const remaining = maxRetries - i - 1;
        if (remaining > 0)
            console.error(`密码错误，还可重试 ${remaining} 次`);
    }
    throw new Error("密码验证失败");
}
export function readLine(prompt) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stderr,
    });
    return new Promise((resolve) => {
        rl.question(prompt, (ans) => {
            rl.close();
            resolve(ans.trim());
        });
    });
}
export async function selectOption(prompt, options) {
    console.log(prompt);
    for (let i = 0; i < options.length; i++)
        console.log(`  ${i + 1}. ${options[i].label}`);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stderr,
    });
    return new Promise((resolve) => {
        rl.question("选择 (输入数字): ", (ans) => {
            rl.close();
            const idx = parseInt(ans.trim(), 10) - 1;
            resolve(idx >= 0 && idx < options.length
                ? options[idx].value
                : options[0].value);
        });
    });
}
export async function confirm(prompt) {
    const ans = await readLine(`${prompt} (y/N): `);
    return ans.toLowerCase() === "y" || ans.toLowerCase() === "yes";
}
