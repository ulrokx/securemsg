import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config
/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/graphql": {
        target: "http://localhost:4000/graphql",
        changeOrigin: true,
      },
    },
  },
});
