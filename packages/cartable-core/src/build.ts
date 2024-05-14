import { existsSync } from "fs";
import { resolve } from "path";
import { rspack } from "@rspack/core";
import { UserConfig } from "./types";
import { generateRspackConfig } from "./generateRspackConfig";

export const startBuild = () => {
  const options = {
    env: "production",
    command: "build",
  } as const;

  const configPath = resolve("cartable.config.js");
  let userConfig: UserConfig = {};

  if (existsSync(configPath)) {
    userConfig = require(configPath);
  }

  // Allow user to override the webpack config
  let rspackConfig = generateRspackConfig(options);
  if (userConfig.rspack) {
    rspackConfig = userConfig.rspack(rspackConfig);
  }

  rspack(rspackConfig, (err, stats) => {
    if (err || stats?.hasErrors()) {
      process.exitCode = 1;
    }
  });
};
