import { RspackOptions, SwcLoaderOptions } from "@rspack/core";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import nodeExternals from "webpack-node-externals";
import NodemonWebpackPlugin from "nodemon-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import FriendlyErrorsWebpackPlugin from "@nuxt/friendly-errors-webpack-plugin";
import { consola } from "consola";
import { paths } from "./paths";

interface RspackConfigOptions {
  env: "development" | "production" | string;
  command: "build" | "dev";
}

export const generateRspackConfig = (
  options: RspackConfigOptions,
): RspackOptions => {
  const swcRcPath = resolve(".swcrc");
  const hasSwcRc = existsSync(swcRcPath);
  const tsConfigPath = resolve("tsconfig.json");
  const useTypeScript = existsSync(tsConfigPath);

  let swrOptions: SwcLoaderOptions | undefined;

  // If user has swcrc file, use it
  if (hasSwcRc) {
    console.log("> Using .swcrc defined in your app root");
  } else {
    swrOptions = {
      jsc: {
        externalHelpers: true,
        target: "es2022",
        parser: !useTypeScript
          ? {
              syntax: "ecmascript",
              jsx: false,
            }
          : {
              syntax: "typescript",
              tsx: false,
            },
      },
    };
  }

  return {
    mode: options.env === "development" ? "development" : "production",

    // Webpack can target multiple environments such as `node`,
    // `browser`, and even `electron`. Since cartable is focused on Node,
    // we set the default target accordingly.
    target: "node",

    // Sourcemap makes debugging dramatically easier although it slows down compilation.
    devtool: "source-map",

    // Webpack allows you to define externals - modules that should not be
    // bundled. When bundling with Webpack for the backend - you usually
    // don't want to bundle its node_modules dependencies. This creates an externals
    // function that ignores node_modules when bundling in Webpack.
    // @see https://github.com/liady/webpack-node-externals
    externals: [nodeExternals() as any],
    externalsPresets: { node: true },

    node: {
      __filename: true,
      __dirname: true,
    },

    entry: {
      main: [`${paths.serverSrcPath}/index.${!useTypeScript ? "js" : "ts"}`],
    },

    // This sets the default output file path, name, and compile target
    // module type. Since we are focused on Node.js, the libraryTarget
    // is set to CommonJS
    output: {
      path: paths.serverBuildPath,
      filename: "index.js",
      sourceMapFilename: "index.map",
      publicPath: paths.publicPath,
      libraryTarget: "commonjs",
    },

    // Add `.ts` as a resolvable extension.
    resolve: {
      extensions: [".ts", ".js"],
    },

    // Define a few default rspack loaders.
    module: {
      rules: [
        // Process JS/TS files with swc
        {
          test: /\.(js|mjs|ts|mts)$/,
          exclude: /node_modules/,
          use: {
            loader: "builtin:swc-loader",
            options: swrOptions,
          },
        },
      ],
    },

    plugins: [
      // Use nodemon to reload the server in development mode when changes are made.
      options.command === "build"
        ? new NodemonWebpackPlugin({
            script: `${paths.serverBuildPath}/index.js`,
            quiet: true,
          })
        : undefined,

      // As swc is only transpiling, ForkTsCheckerWebpackPlugin is responsible for
      // the type checking.
      useTypeScript
        ? new ForkTsCheckerWebpackPlugin({
            logger: {
              log: consola.info,
              error: consola.error,
            },
          })
        : undefined,

      // The FriendlyErrorsWebpackPlugin
      // gives cartable its human-readable error messages.
      new FriendlyErrorsWebpackPlugin({
        clearConsole: options.env === "development",
      }),
    ].filter(Boolean) as any,
  };
};
