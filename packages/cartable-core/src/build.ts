import { existsSync } from "fs";
import { resolve } from "path";
import { rspack } from "@rspack/core";
import { UserConfig } from "./types";
import { generateRspackConfig } from "./generateRspackConfig";

export const startBuild = () => {
  const options = {
    env: "production",
  };

  const configPath = resolve("cartable.config.js");
  let userConfig: UserConfig = {};

  if (existsSync(configPath)) {
    userConfig = require(configPath);
  }

  // Allow user to override the webpack config
  let rspackConfig = generateRspackConfig(options);
  // TODO migrate this to rspack
  // if (userConfig.webpack) {
  //   webpackConfig = userConfig.webpack(webpackConfig);
  // }

  rspack(rspackConfig, (err, stats) => {
    if (err || stats?.hasErrors()) {
      process.exitCode = 1;
    }
  });
};
