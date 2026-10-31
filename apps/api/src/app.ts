import express, { type ErrorRequestHandler } from "express";
import type { DataSource } from "typeorm";

/** Build the Express app. Takes its DataSource so tests can inject the test database. */
export function createApp(dataSource: DataSource) {
  const app = express();
  app.use(express.json());

  app.get("/api/health", async (_req, res) => {
    try {
      await dataSource.query("SELECT 1");
      res.json({ status: "ok", db: "ok" });
    } catch {
      res.status(503).json({ status: "degraded", db: "down" });
    }
  });

  // Register feature routers here, e.g. app.use("/api/items", itemsRouter(dataSource));

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
