import { resolve } from "node:path";
import { defineConfig, devices } from "@playwright/test";

try {
  process.loadEnvFile(resolve(import.meta.dirname, "../../.env"));
} catch {
  // No root .env: defaults apply.
}

// E2E runs its own API + web servers on separate ports, against the TEST database,
// so it never touches dev data and can run while `npm run dev` is up.
const E2E_API_PORT = process.env.E2E_API_PORT ?? "3101";
const E2E_WEB_PORT = process.env.E2E_WEB_PORT ?? "5174";
const testDb = `${process.env.DB_NAME ?? "app"}_test`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${E2E_WEB_PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "npx tsx src/server.ts",
      cwd: "../api",
      url: `http://localhost:${E2E_API_PORT}/api/health`,
      // WEB_PORT sets better-auth's baseURL, so it trusts the e2e web origin.
      env: { API_PORT: E2E_API_PORT, DB_NAME: testDb, WEB_PORT: E2E_WEB_PORT },
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: `npx vite --port ${E2E_WEB_PORT} --strictPort`,
      url: `http://localhost:${E2E_WEB_PORT}`,
      env: { API_URL: `http://localhost:${E2E_API_PORT}`, WEB_PORT: E2E_WEB_PORT },
      reuseExistingServer: false,
      timeout: 60_000,
    },
  ],
});
