import { Command } from "commander";
import { registerInit } from "./commands/init.js";
import { registerUnlock } from "./commands/unlock.js";
import { registerLock } from "./commands/lock.js";
import { registerStatus } from "./commands/status.js";
import { registerGet } from "./commands/get.js";
import { registerList } from "./commands/list.js";
import { registerSearch } from "./commands/search.js";
import { registerAdd } from "./commands/add.js";
import { registerEdit } from "./commands/edit.js";
import { registerDelete } from "./commands/delete.js";
import { registerSkill } from "./commands/skill.js";
const program = new Command();
program
    .name("key-vault")
    .description("通用 AI Agent 凭据托管服务")
    .version("1.0.0");
registerInit(program);
registerUnlock(program);
registerLock(program);
registerStatus(program);
registerGet(program);
registerList(program);
registerSearch(program);
registerAdd(program);
registerEdit(program);
registerDelete(program);
registerSkill(program);
program.parse();
