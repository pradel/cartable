import { program, Option } from "commander";

const packageJson = require("../package.json");
program.version(packageJson.version);

const templates = ["typescript", "javascript"];

interface ProgramOption {
  template: "typescript" | "javascript";
}

program
  .argument("<project-directory>", "project directory")
  .usage("<project-directory> [options]")
  .addOption(
    new Option("-t, --template <type>", "specify a template")
      .choices(templates)
      .default("typescript")
  )
  .parse();

const run = async () => {
  const options = program.opts<ProgramOption>();
  const projectDirectory = program.args[0];

  // 1. Copy template files
  // 2. Install deps
  // 3. Print success message
};

run();
