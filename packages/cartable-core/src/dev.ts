import { existsSync } from "fs";
import { resolve } from "path";
import webpack from "webpack";
import { UserConfig } from "./types";
import { generateWebpackConfig } from "./webpack.config";

export const startDev = () => {
  const options = {
    env: "development",
  };

  const configPath = resolve("cartable.config.js");
  let userConfig: UserConfig = {};

  if (existsSync(configPath)) {
    userConfig = require(configPath);
  }

  // Allow user to override the webpack config
  let webpackConfig = generateWebpackConfig(options);
  if (userConfig.webpack) {
    webpackConfig = userConfig.webpack(webpackConfig);
  }

  const serverCompiler = webpack(webpackConfig);

  // Start webpack in watch mode
  serverCompiler.watch({}, (error, stats) => {
    if (error || stats?.hasErrors()) {
      process.exitCode = 1;
    }
  });
};
