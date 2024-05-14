import { existsSync } from "fs";
import { resolve } from "path";
import { rspack } from "@rspack/core";
import { UserConfig } from "./types";
import { generateRspackConfig } from "./generateRspackConfig";

export const startDev = () => {
  const options = {
    env: "development",
    command: "dev",
  } as const;

  const configPath = resolve("cartable.config.js");
  let userConfig: UserConfig = {};

  if (existsSync(configPath)) {
    userConfig = require(configPath);
  }

  // Allow user to override the rspack config
  let rspackConfig = generateRspackConfig(options);
  if (userConfig.rspack) {
    rspackConfig = userConfig.rspack(rspackConfig);
  }

  const serverCompiler = rspack(rspackConfig);

  // Start rspack in watch mode
  serverCompiler.watch({}, (error, stats) => {
    if (error || stats?.hasErrors()) {
      process.exitCode = 1;
    }
  });
};
