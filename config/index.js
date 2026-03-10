import { defineConfig } from "@tarojs/cli";
import path from "path";

import devConfig from "./dev";
import prodConfig from "./prod";

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig(async (merge, { command, mode }) => {
  const baseConfig = {
    projectName: "taro-vue3-template",
    date: "2025-1-1",
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: "src",
    outputRoot: "dist",
    plugins: ["@tarojs/plugin-generator"],
    defineConstants: {},
    copy: {
      patterns: [
        { from: 'public/', to: 'dist/' },
      ],
      options: {},
    },
    framework: "vue3",
    compiler: {
      type: "vite",
      vitePlugins: [
        {
          name: "taro-tailwind-postcss",
          config(config) {
            if (config.css?.postcss?.plugins) {
              config.css.postcss.plugins.unshift(require("tailwindcss")());
            }
          },
        },
      ],
    },
    alias: {
      "@": path.resolve(__dirname, "..", "src"),
      "@/apis": path.resolve(__dirname, "..", "src/apis"),
      "@/utils": path.resolve(__dirname, "..", "src/utils"),
      "@/constants": path.resolve(__dirname, "..", "src/constants"),
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false,
        },
      },
    },
    h5: {
      publicPath: "./",
      staticDirectory: "static",
      esnextModules: ["taro-ui"],
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: "css/[name].[hash].css",
        chunkFilename: "css/[name].[chunkhash].css",
      },
      postcss: {
        autoprefixer: {
          enable: true,
        },
        cssModules: {
          enable: false,
        },
      },
    },
    rn: {
      appName: "taroDemo",
      postcss: {
        cssModules: {
          enable: false,
        },
      },
    },
  };

  process.env.BROWSERSLIST_ENV = process.env.NODE_ENV;

  if (process.env.NODE_ENV === "development") {
    return merge({}, baseConfig, devConfig);
  }
  return merge({}, baseConfig, prodConfig);
});
