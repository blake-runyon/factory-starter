import { toNodeHandler } from "better-auth/node";
import express, { type ErrorRequestHandler } from "express";
import type { DataSource } from "typeorm";
import { createAuth } from "./auth.ts";
import { loadConfig, type Config } from "./config.ts";
import { requireAuth } from "./require-auth.ts";

/**
 * Build the Express app. Takes its DataSource so tests can inject the test database.
 * The DataSource must already be initialized (auth shares its connection pool).
 */
export function createApp(dataSource: DataSource, authConfig: Config["auth"] = loadConfig(process.env).auth) {
  const auth = createAuth(dataSource, authConfig);
  const app = express();

  // better-auth parses its own request bodies, so mount it before express.json().
  app.all("/api/auth/{*splat}", toNodeHandler(auth));
  app.use(express.json());

  app.get("/api/health", async (_req, res) => {
    try {
      await dataSource.query("SELECT 1");
      res.json({ status: "ok", db: "ok" });
    } catch {
      res.status(503).json({ status: "degraded", db: "down" });
    }
  });

  app.get("/api/me", requireAuth(auth), (_req, res) => {
    res.json({ user: res.locals.session!.user });
  });

  // Register feature routers here, e.g. app.use("/api/items", itemsRouter(dataSource, auth));
  // Protect a router with requireAuth(auth); the session is then on res.locals.session.

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  };
  app.use(errorHandler);

  return app;
}
