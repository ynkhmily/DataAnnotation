import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const PUBLIC_PATH = "/";
const OUT_DIR = 'build';
const PLUGINS  =  [react()]
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: "8080",
    hmr: {
      overlay: false
    }
  },
  plugins: [
    PLUGINS
  ],
  base: PUBLIC_PATH,
  build: {
    outDir: OUT_DIR
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "lib",
        replacement: resolve(__dirname, "lib"),
      },
    ],
  },
});
