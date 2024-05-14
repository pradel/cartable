import { RspackOptions } from "@rspack/core";

export interface UserConfig {
  rspack?: (config: RspackOptions) => RspackOptions;
}
