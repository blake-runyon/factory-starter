import { describe, expect, it } from "vitest";
import { loadConfig } from "../../src/config.ts";

describe("loadConfig", () => {
  it("starter: uses docker-compose defaults when env is empty", () => {
    expect(loadConfig({})).toEqual({
      port: 3000,
      db: { host: "localhost", port: 5432, username: "app", password: "app", database: "app" },
      auth: { secret: expect.any(String), baseURL: "http://localhost:5173" },
    });
  });

  it("starter: reads values from env", () => {
    const config = loadConfig({ API_PORT: "4000", DB_PORT: "6543", DB_NAME: "other" });
    expect(config.port).toBe(4000);
    expect(config.db.port).toBe(6543);
    expect(config.db.database).toBe("other");
  });

  it("starter: rejects an invalid port", () => {
    expect(() => loadConfig({ DB_PORT: "nope" })).toThrow(/DB_PORT/);
  });

  it("auth: reads BETTER_AUTH_SECRET and BETTER_AUTH_URL from env", () => {
    const config = loadConfig({
      BETTER_AUTH_SECRET: "s".repeat(32),
      BETTER_AUTH_URL: "https://app.example.com",
    });
    expect(config.auth).toEqual({ secret: "s".repeat(32), baseURL: "https://app.example.com" });
  });

  it("auth: derives baseURL from WEB_PORT", () => {
    expect(loadConfig({ WEB_PORT: "5174" }).auth.baseURL).toBe("http://localhost:5174");
  });

  it("auth: requires BETTER_AUTH_SECRET in production", () => {
    expect(() => loadConfig({ NODE_ENV: "production" })).toThrow(/BETTER_AUTH_SECRET/);
  });
});
