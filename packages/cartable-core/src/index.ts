// import packageJson from "../package.json";
import { startBuild } from "./build";
import { startDev } from "./dev";

const defaultCommand = "dev";
let userCommand = process.argv[2];

const commands = new Set([defaultCommand, "build"]);

if (new Set(["--version", "-v"]).has(userCommand)) {
  const packageJson = require("../package.json");
  console.log("cartable v" + packageJson.version);
  process.exit(0);
}

if (new Set(["--help", "-h"]).has(userCommand)) {
  console.log(`
Usage
  $ cartable <command>

Available commands
  ${Array.from(commands).join(", ")}
  `);
  process.exit(0);
}

if (!userCommand) {
  userCommand = defaultCommand;
}

if (userCommand === "dev") {
  startDev();
} else if (userCommand === "build") {
  startBuild();
} else {
  console.error(`Unknown command: ${userCommand}`);
  console.log(`
Usage
  $ cartable <command>

Available commands
  ${Array.from(commands).join(", ")}
    `);
  process.exit(1);
}
