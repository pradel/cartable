import type { Config } from "@jest/types";
import { existsSync } from "fs";
import { resolve } from "path";
import { paths } from "./paths";

export const generateJestConfig = (): Config.InitialOptions => {
  const swcRcPath = resolve(".swcrc");
  const hasSwcRc = existsSync(swcRcPath);
  const tsConfigPath = resolve("tsconfig.json");
  const useTypeScript = existsSync(tsConfigPath);

  let swrOptions;

  if (!hasSwcRc) {
    swrOptions = {
      sourceMap: true,
      jsc: {
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
    transform: {
      "^.+\\.(t|j)sx?$": swrOptions ? ["@swc/jest", swrOptions] : "@swc/jest",
    },
    moduleFileExtensions: ["ts", "js", "json"],
    rootDir: paths.rootPath,
  };
};
