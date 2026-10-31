import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { resetDatabase, setupTestApp } from "./helpers.ts";

let ctx: Awaited<ReturnType<typeof setupTestApp>>;

beforeAll(async () => {
  ctx = await setupTestApp();
});
beforeEach(async () => {
  await resetDatabase(ctx.dataSource);
});
afterAll(async () => {
  await ctx.dataSource.destroy();
});

describe("GET /api/health", () => {
  it("starter: reports api and database ok", async () => {
    const res = await request(ctx.app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok", db: "ok" });
  });

  it("starter: is connected to the test database", async () => {
    const [{ db }] = await ctx.dataSource.query("SELECT current_database() AS db");
    expect(db).toMatch(/_test$/);
  });

  it("starter: unknown /api routes return JSON 404", async () => {
    const res = await request(ctx.app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not found" });
  });
});
