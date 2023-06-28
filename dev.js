// This file was automatically compiled from TypeScript. View the original file for a more human-readable version.

import chalk from "chalk";
import { exec, spawn } from "child_process";
import { watch } from "chokidar";
import { consola } from "consola";
import * as readline from "readline";
import treeKill from "tree-kill";
import util from "util";
import { compileTypescript } from "./compile.js";
readline.emitKeypressEvents(process.stdin);
const config = {
  command: {
    name: "railway",
    args: ["run", "node", "--max-old-space-size=100", "app.js"]
  },
  watch: ["ts", "hbs", "css"].map((ext) => `**/*.${ext}`),
  ignore: ["**/node_modules/**", "dev.ts"]
};
const kill = util.promisify(treeKill);
let running;
async function spawnProcess(compile = true) {
  if (compile)
    await compileTypescript();
  running = spawn(config.command.name, config.command.args, { stdio: "inherit", shell: true });
}
spawnProcess(false);
function logMessage(...message) {
  consola.log(`${chalk.blue("[Auto Reload]:")}`, ...message);
}
async function restartProcess() {
  logMessage("Restarting...");
  await kill(running.pid);
  spawnProcess();
  await new Promise((resolve) => setTimeout(resolve, 500));
}
async function stopProcess() {
  logMessage("Killing process...");
  await kill(running.pid);
  process.exit(0);
}
function openWebsite() {
  logMessage("Opening website...");
  exec(`open http://localhost:${process.env.PORT || 3e3}`);
}
process.stdin.resume();
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
logMessage("Starting!");
logMessage("Press Ctrl+R to reload, Ctrl+C to stop, and Ctrl+O to open the website");
process.on("exit", () => stopProcess());
process.stdin.on("keypress", (_, key) => {
  if (key.ctrl)
    switch (key.name) {
      case "c":
        return stopProcess();
      case "r":
        return restartProcess();
      case "o":
        return openWebsite();
      default:
    }
});
let restarting = false;
watch(config.watch, { ignored: config.ignore }).on("change", async () => {
  if (restarting)
    return;
  restarting = true;
  await restartProcess();
  restarting = false;
});
