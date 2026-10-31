import { describe, expect, it } from "vitest";
import { loadConfig } from "../../src/config.ts";

describe("loadConfig", () => {
  it("starter: uses docker-compose defaults when env is empty", () => {
    expect(loadConfig({})).toEqual({
      port: 3000,
      db: { host: "localhost", port: 5432, username: "app", password: "app", database: "app" },
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
});
