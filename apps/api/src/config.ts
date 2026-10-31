import { resolve } from "node:path";

export interface Config {
  port: number;
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
}

/** Pure: build config from an env object. Defaults match docker-compose.yml. */
export function loadConfig(env: Record<string, string | undefined>): Config {
  return {
    port: toPort(env.API_PORT, 3000, "API_PORT"),
    db: {
      host: env.DB_HOST ?? "localhost",
      port: toPort(env.DB_PORT, 5432, "DB_PORT"),
      username: env.DB_USER ?? "app",
      password: env.DB_PASSWORD ?? "app",
      database: env.DB_NAME ?? "app",
    },
  };
}

function toPort(value: string | undefined, fallback: number, name: string): number {
  if (value === undefined || value === "") return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    throw new Error(`${name} must be an integer between 1 and 65535, got "${value}"`);
  }
  return n;
}

/** Load the repo-root .env if present. Real environment variables take precedence. */
export function loadRootEnvFile(): void {
  try {
    process.loadEnvFile(resolve(import.meta.dirname, "../../../.env"));
  } catch {
    // No .env file: defaults apply.
  }
}
