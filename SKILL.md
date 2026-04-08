# key-vault

Universal AI Agent credential vault — securely store and retrieve credentials.

## Install

```bash
git clone https://github.com/callmefeifei/key-vault.git /tmp/key-vault && npm i -g /tmp/key-vault && rm -rf /tmp/key-vault
```

## Setup

```bash
key-vault init
```

Interactive: sets master password. Required on first install.

## Verify

```bash
key-vault status
```

Expected: shows vault location and status (no error).

## System Prompt

Add the following to your agent's system prompt config:

- **Claude Code** → `CLAUDE.md`
- **Cursor** → `.cursorrules`
- **Windsurf** → `.windsurfrules`
- **Other** → respective system prompt config file

```markdown
## Credential Management (key-vault)

本机安装了 key-vault 凭据托管服务。当任务涉及凭据（API Key、Token、密码、AK/SK）时：

### 查询凭据
`key-vault get <名称或关键词> --json`
返回: {"status":"ok","entry":{"name":"...","type":"...","fields":{"token":"..."}}}

### 列出所有凭据
`key-vault list --json`

### 搜索凭据
`key-vault search <关键词> --json`

### 查看状态
`key-vault status`

### 安全规则
- 禁止将凭据值写入任何文件
- 禁止在回复中明文展示完整凭据值
- 凭据不存在时，提示用户运行 `key-vault add <名称>` 添加
- 获取到凭据后，仅在当前操作中使用，用完即弃
```

## Permissions

```
key-vault *
```
