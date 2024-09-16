import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: "./public/index.html",
  },
  output: {
    assetPrefix: "https://rikublock.github.io/metadata-reader/",
    copy: [
      {
        from: "./node_modules/mediainfo.js/dist/MediaInfoModule.wasm",
        to: ".",
      },
    ],
  },
});
