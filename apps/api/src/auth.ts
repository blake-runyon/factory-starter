import { betterAuth } from "better-auth";
import type { Pool } from "pg";
import type { DataSource } from "typeorm";
import type { Config } from "./config.ts";

/**
 * Build the better-auth instance (email + password).
 *
 * better-auth talks to Postgres through TypeORM's own connection pool, so there is one pool
 * per process and it closes with `dataSource.destroy()`. The dataSource must be initialized.
 * Auth tables (user, session, account, verification) are created by a TypeORM migration,
 * never by better-auth's own migrator.
 */
export function createAuth(dataSource: DataSource, config: Config["auth"]) {
  const pool = (dataSource.driver as unknown as { master?: Pool }).master;
  if (!pool) throw new Error("createAuth: initialize the DataSource first");

  return betterAuth({
    database: pool,
    secret: config.secret,
    baseURL: config.baseURL,
    basePath: "/api/auth",
    emailAndPassword: { enabled: true },
  });
}

export type Auth = ReturnType<typeof createAuth>;
