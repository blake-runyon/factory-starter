import "reflect-metadata";
import { resolve } from "node:path";
import { DataSource } from "typeorm";
import { loadConfig, loadRootEnvFile, type Config } from "./config.ts";
import { entities } from "./entities/index.ts";

const here = import.meta.dirname;

export function createDataSource(db: Config["db"]): DataSource {
  return new DataSource({
    type: "postgres",
    ...db,
    entities,
    migrations: [resolve(here, "migrations/*.{ts,js}")],
    // Schema changes go through migrations only. Never enable synchronize.
    synchronize: false,
    logging: ["error"],
  });
}

loadRootEnvFile();

/** Used by the TypeORM CLI (migration:generate / run / revert). */
export const AppDataSource = createDataSource(loadConfig(process.env).db);
