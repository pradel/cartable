import { join, resolve } from "path";

const rootPath = resolve(process.cwd());

export const paths = {
  rootPath,
  serverSrcPath: join(rootPath, "src"),
  serverBuildPath: join(rootPath, "dist"),
  publicPath: join(rootPath, "public"),
};
