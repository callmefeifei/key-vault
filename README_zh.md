# key-vault

通用 AI Agent 凭据保险库，为任何 AI 编程助手安全存储和检索凭据。

[English](README.md) | 中文文档

## 安装

```bash
git clone https://github.com/callmefeifei/key-vault.git /tmp/key-vault && cd /tmp/key-vault && npm install --omit=dev && npm i -g . && cd / && rm -rf /tmp/key-vault
```

## 快速开始

```bash
# 初始化保险库
key-vault init

# 添加凭据
key-vault add my-api-key --type token

# 查询凭据（JSON 输出，供 AI Agent 调用）
key-vault get my-api-key --json

# 列出所有凭据
key-vault list
```

## AI Agent 集成

运行 `key-vault skill` 获取 prompt 片段，粘贴到你的 Agent 系统提示配置中：

- **Claude Code** → `CLAUDE.md`
- **Cursor** → `.cursorrules`
- **Windsurf** → `.windsurfrules`
- **其他 Agent** → 对应的配置文件

或者直接告诉你的 AI Agent：

> "帮我装下这个 skill https://github.com/callmefeifei/key-vault"

Agent 会自动读取 [SKILL.md](SKILL.md) 完成安装和配置。

## 命令列表

| 命令 | 说明 |
|------|------|
| `key-vault init` | 初始化保险库，设置主密码 |
| `key-vault unlock` | 交互式解锁 |
| `key-vault lock` | 锁定（清除密码缓存） |
| `key-vault status` | 查看状态 |
| `key-vault add [name]` | 添加凭据 |
| `key-vault get <query>` | 查询凭据 |
| `key-vault list` | 列出所有凭据 |
| `key-vault search <keyword>` | 搜索凭据 |
| `key-vault edit <name>` | 编辑凭据 |
| `key-vault delete <name>` | 删除凭据 |
| `key-vault skill` | 输出 AI Agent 集成 prompt |

## 安全设计

- AES-256-GCM 加密 + PBKDF2 密钥派生（600,000 次迭代）
- 凭据不以明文写入磁盘
- 审计日志记录每次访问
- `--json` 输出仅通过 stdout，不落盘

## 环境变量

- `KEY_VAULT_PASSWORD` — 主密码（用于非交互环境）
- `KEY_VAULT_DIR` — 自定义存储目录（默认 `~/.key-vault`）

## 许可证

MIT
