import { loadConfig } from "../../src/config.ts";
import { createDataSource } from "../../src/data-source.ts";

/** Runs once before the API suite: bring the test database schema up to date. */
export default async function setup() {
  const dataSource = createDataSource(loadConfig(process.env).db);
  await dataSource.initialize();
  await dataSource.runMigrations();
  await dataSource.destroy();
}
