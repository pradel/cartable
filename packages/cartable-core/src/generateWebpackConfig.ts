import { existsSync } from "fs";
import { resolve } from "path";
import webpack from "webpack";
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
): webpack.Configuration => {
  const swcRcPath = resolve(".swcrc");
  const hasSwcRc = existsSync(swcRcPath);
  const tsConfigPath = resolve("tsconfig.json");
  const useTypeScript = existsSync(tsConfigPath);

  let swrOptions;

  // If user has swcrc file, use it
  if (hasSwcRc) {
    console.log("> Using .swcrc defined in your app root");
  } else {
    swrOptions = {
      sourceMap: true,
      jsc: {
        externalHelpers: true,
        target: "es2020",
        parser: !useTypeScript
          ? {
              syntax: "ecmascript",
              jsx: false,
              dynamicImport: true,
            }
          : {
              syntax: "typescript",
              tsx: false,
              dynamicImport: true,
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
    externals: [nodeExternals()],

    node: {
      __filename: true,
      __dirname: true,
    },

    entry: {
      main: [`${paths.serverSrcPath}/index.${!useTypeScript ? "js" : "ts"}`],
    },

    // This sets the default output file path, name, and compile target
    // module type. Since we are focused on Node.js, the libraryTarget
    // is set to CommonJS2
    output: {
      path: paths.serverBuildPath,
      filename: "index.js",
      sourceMapFilename: "index.map",
      publicPath: paths.publicPath,
      libraryTarget: "commonjs2",
    },

    // Add `.ts` as a resolvable extension.
    resolve: {
      extensions: [".ts", ".js"],
    },

    // Define a few default Webpack loaders.
    module: {
      rules: [
        // Process JS/TS files with swc
        {
          test: /\.(js|mjs|ts)$/,
          exclude: /node_modules/,
          loader: require.resolve("swc-loader"),
          options: swrOptions,
        },
      ],
    },

    plugins: [
      // Use nodemon to reload the server in development mode when changes are made.
      new NodemonWebpackPlugin({
        script: `${paths.serverBuildPath}/index.js`,
        quiet: true,
      }),

      // In order to provide sourcemaps, we automatically insert this at the
      // top of each file using the BannerPlugin.
      new webpack.BannerPlugin({
        raw: true,
        entryOnly: false,
        banner: `require('${
          // Is source-map-support installed as project dependency, or linked?
          require.resolve("source-map-support").indexOf(process.cwd()) === 0
            ? // If it's resolvable from the project root, it's a project dependency.
              "source-map-support/register"
            : // It's not under the project, it's linked via lerna.
              require.resolve("source-map-support/register")
        }');`,
      }),

      // As swc is only transpiling, ForkTsCheckerWebpackPlugin is responsible for
      // the type checking.
      useTypeScript ? new ForkTsCheckerWebpackPlugin() : undefined,

      // The FriendlyErrorsWebpackPlugin (when combined with source-maps)
      // gives cartable its human-readable error messages.
      new FriendlyErrorsWebpackPlugin({
        clearConsole: options.env === "development",
      }),
    ].filter(Boolean),
  };
};
