import { existsSync } from "fs";
import { join } from "path";
import * as jest from "jest";
import { generateJestConfig } from "./generateJestConfig";
import { paths } from "./paths";

export const startTest = () => {
  const jestConfigPath = join(paths.rootPath, "jest.config.js");
  const appPackageJson = require(join(paths.rootPath, "package.json"));

  // Allow user to override the jest config
  let jestConfig = generateJestConfig();

  // Config can come from package.json jest key
  if (appPackageJson.jest) {
    jestConfig = {
      ...jestConfig,
      ...appPackageJson.jest,
    };
  }

  // Config can also come from a jest config file
  if (existsSync(jestConfigPath)) {
    const jestConfigContents = require(jestConfigPath);
    jestConfig = { ...jestConfig, ...jestConfigContents };
  }

  const argv = process.argv.slice(2);

  argv.push(
    "--config",
    JSON.stringify({
      ...jestConfig,
    }),
  );

  const [, ...argsToPassToJestCli] = argv;
  jest.run(argsToPassToJestCli);
};
