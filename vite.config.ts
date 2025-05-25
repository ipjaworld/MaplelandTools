// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  resolve: {
    alias: {
      // ESM 환경에서 @ → ./src 로 매핑
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  plugins: [react()],
});
