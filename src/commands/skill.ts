import type { Command } from "commander";

const SKILL_PROMPT = `## Credential Management (key-vault)

本机安装了 key-vault 凭据托管服务。当任务涉及凭据（API Key、Token、密码、AK/SK）时：

### 查询凭据
\`key-vault get <名称或关键词> --json\`
返回: {"status":"ok","entry":{"name":"...","type":"...","fields":{"token":"..."}}}

### 列出所有凭据
\`key-vault list --json\`

### 搜索凭据
\`key-vault search <关键词> --json\`

### 查看状态
\`key-vault status\`

### 安全规则
- 禁止将凭据值写入任何文件
- 禁止在回复中明文展示完整凭据值
- 凭据不存在时，提示用户运行 \`key-vault add <名称>\` 添加
- 获取到凭据后，仅在当前操作中使用，用完即弃`;

const MARKDOWN_GUIDE = `# key-vault 集成指南

## 概述
key-vault 是一个通用 AI Agent 凭据托管服务，支持安全存储和检索各类凭据。

## 安装
\`\`\`bash
npm install -g key-vault
\`\`\`

## 初始化
\`\`\`bash
key-vault init
\`\`\`

## 常用命令
| 命令 | 说明 |
|------|------|
| \`key-vault init\` | 初始化凭据库 |
| \`key-vault add [name]\` | 添加凭据 |
| \`key-vault get <query>\` | 查询凭据 |
| \`key-vault list\` | 列出所有凭据 |
| \`key-vault search <keyword>\` | 搜索凭据 |
| \`key-vault status\` | 查看状态 |
| \`key-vault unlock\` | 解锁凭据库 |
| \`key-vault lock\` | 锁定凭据库 |

## Agent 集成

将以下 prompt 片段添加到 Agent 的系统提示中：

${SKILL_PROMPT}

## 环境变量
- \`KEY_VAULT_PASSWORD\` — 主密码（用于非交互环境）
- \`KEY_VAULT_DIR\` — 自定义存储目录
`;

export function registerSkill(program: Command): void {
  program
    .command("skill")
    .description("输出 Agent 集成 prompt 片段")
    .option("--markdown", "输出完整集成指南")
    .action((opts: { markdown?: boolean }) => {
      if (opts.markdown) {
        console.log(MARKDOWN_GUIDE);
      } else {
        console.log(SKILL_PROMPT);
      }
    });
}
