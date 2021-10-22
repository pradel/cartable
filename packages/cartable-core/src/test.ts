import { existsSync } from "fs";
import { resolve } from "path";
import * as jest from "jest";
import { generateJestConfig } from "./generateJestConfig";
import { UserConfig } from "./types";

export const startTest = () => {
  const configPath = resolve("cartable.config.js");
  let userConfig: UserConfig = {};

  if (existsSync(configPath)) {
    userConfig = require(configPath);
  }

  // TODO
  // // Allow user to override the webpack config
  // let jestConfig = generateJestConfig(options);
  // if (userConfig.webpack) {
  //   webpackConfig = userConfig.webpack(webpackConfig);
  // }

  let jestConfig = generateJestConfig();

  const argv = process.argv.slice(2);

  argv.push(
    "--config",
    JSON.stringify({
      ...jestConfig,
    })
  );

  const [, ...argsToPassToJestCli] = argv;
  jest.run(argsToPassToJestCli);
};
