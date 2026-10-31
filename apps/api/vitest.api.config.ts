import { loadConfig, loadRootEnvFile } from "./src/config.ts";
import { defineConfig } from "vitest/config";

loadRootEnvFile();
const testDb = `${loadConfig(process.env).db.database}_test`;
// Set on this process too: globalSetup runs here, not in a test worker.
process.env.DB_NAME = testDb;

export default defineConfig({
  test: {
    include: ["test/api/**/*.test.ts"],
    globalSetup: ["test/api/global-setup.ts"],
    // Always the test database, never the dev database.
    env: { DB_NAME: testDb },
    // Test files share one database, so run them one at a time.
    fileParallelism: false,
    hookTimeout: 30_000,
  },
});
