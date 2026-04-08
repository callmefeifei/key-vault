# key-vault

Universal AI Agent credential vault. Securely store and retrieve credentials for any AI coding assistant.

README | [中文文档](README_zh.md)

## Install

```bash
git clone https://github.com/callmefeifei/key-vault.git /tmp/key-vault && npm i -g /tmp/key-vault && rm -rf /tmp/key-vault
```

## Quick Start

```bash
# Initialize vault
key-vault init

# Add a credential
key-vault add my-api-key --type token

# Retrieve (JSON output for AI agents)
key-vault get my-api-key --json

# List all credentials
key-vault list
```

## AI Agent Integration

Run `key-vault skill` to get the prompt snippet, then paste it into your agent's system prompt config:

- **Claude Code** → `CLAUDE.md`
- **Cursor** → `.cursorrules`
- **Other agents** → respective config file

## Commands

| Command | Description |
|---------|-------------|
| `key-vault init` | Initialize vault with master password |
| `key-vault unlock` | Unlock vault interactively |
| `key-vault lock` | Lock vault (clear password cache) |
| `key-vault status` | Show vault status |
| `key-vault add [name]` | Add credential |
| `key-vault get <query>` | Get credential |
| `key-vault list` | List all credentials |
| `key-vault search <keyword>` | Search credentials |
| `key-vault edit <name>` | Edit credential |
| `key-vault delete <name>` | Delete credential |
| `key-vault skill` | Output AI agent integration prompt |

## Security

- AES-256-GCM encryption with PBKDF2 key derivation (600,000 iterations)
- Credentials never written to disk in plaintext
- Audit logging for all access
- `--json` output via stdout only (no file persistence)

## Environment Variables

- `KEY_VAULT_PASSWORD` — Master password (for non-interactive use)
- `KEY_VAULT_DIR` — Custom vault directory (default: `~/.key-vault`)

## License

MIT
