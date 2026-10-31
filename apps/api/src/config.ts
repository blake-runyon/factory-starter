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
  auth: {
    /** Signs session cookies. Must be set (32+ random chars) outside development/test. */
    secret: string;
    /** Public origin the browser uses to reach the app (the web server, which proxies /api). */
    baseURL: string;
  };
}

const DEV_AUTH_SECRET = "dev-only-insecure-better-auth-secret-change-me";

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
    auth: {
      secret: authSecret(env),
      baseURL:
        env.BETTER_AUTH_URL ||
        `http://localhost:${toPort(env.WEB_PORT, 5173, "WEB_PORT")}`,
    },
  };
}

function authSecret(env: Record<string, string | undefined>): string {
  if (env.BETTER_AUTH_SECRET) return env.BETTER_AUTH_SECRET;
  if (env.NODE_ENV === "production") {
    throw new Error("BETTER_AUTH_SECRET must be set in production");
  }
  return DEV_AUTH_SECRET;
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
