import { existsSync } from "fs";
import { resolve } from "path";
// import webpack from "webpack";
import NodemonWebpackPlugin from "nodemon-webpack-plugin";
import nodeExternals from "webpack-node-externals";
import FriendlyErrorsWebpackPlugin from "@soda/friendly-errors-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { paths } from "./paths";

interface generateWebpackConfigOptions {
  env: "development" | "production" | string;
}

export const generateWebpackConfig = (
  options: generateWebpackConfigOptions,
) => {
  const swcRcPath = resolve(".swcrc");
  const hasSwcRc = existsSync(swcRcPath);
  const tsConfigPath = resolve("tsconfig.json");
  const useTypeScript = existsSync(tsConfigPath);

  return {
    node: {
      __filename: true,
      __dirname: true,
    },

    plugins: [
      // Use nodemon to reload the server in development mode when changes are made.
      new NodemonWebpackPlugin({
        script: `${paths.serverBuildPath}/index.js`,
        quiet: true,
      }),

      // // In order to provide sourcemaps, we automatically insert this at the
      // // top of each file using the BannerPlugin.
      // new webpack.BannerPlugin({
      //   raw: true,
      //   entryOnly: false,
      //   banner: `require('${
      //     // Is source-map-support installed as project dependency, or linked?
      //     require.resolve("source-map-support").indexOf(process.cwd()) === 0
      //       ? // If it's resolvable from the project root, it's a project dependency.
      //         "source-map-support/register"
      //       : // It's not under the project, it's linked via lerna.
      //         require.resolve("source-map-support/register")
      //   }');`,
      // }),
    ].filter(Boolean),
  };
};
