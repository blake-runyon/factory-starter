import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Read the repo-root .env (same file docker compose and the API use).
  const env = { ...loadEnv(mode, resolve(import.meta.dirname, "../.."), ""), ...process.env };
  const apiUrl = env.API_URL ?? `http://localhost:${env.API_PORT ?? 3000}`;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { "@": resolve(import.meta.dirname, "src") },
    },
    server: {
      port: Number(env.WEB_PORT ?? 5173),
      strictPort: true,
      proxy: { "/api": apiUrl },
    },
  };
});
