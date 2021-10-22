import webpack from "webpack";

export interface UserConfig {
  webpack?: (config: webpack.Configuration) => webpack.Configuration;
}
