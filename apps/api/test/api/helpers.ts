import type { DataSource } from "typeorm";
import { createApp } from "../../src/app.ts";
import { loadConfig } from "../../src/config.ts";
import { createDataSource } from "../../src/data-source.ts";

/** A DataSource pointed at the test database (DB_NAME is forced in vitest.api.config.ts). */
export async function setupTestApp() {
  const dataSource = createDataSource(loadConfig(process.env).db);
  await dataSource.initialize();
  return { app: createApp(dataSource), dataSource };
}

/** better-auth's tables: created by migration, not TypeORM entities, so listed here. */
const AUTH_TABLES = ["user", "session", "account", "verification"];

/** Empty every entity table and the auth tables. Call in beforeEach so each test starts clean. */
export async function resetDatabase(dataSource: DataSource) {
  const tables = [...dataSource.entityMetadatas.map((m) => m.tableName), ...AUTH_TABLES].map(
    (t) => `"${t}"`,
  );
  if (tables.length > 0) {
    await dataSource.query(`TRUNCATE ${tables.join(", ")} RESTART IDENTITY CASCADE`);
  }
}
