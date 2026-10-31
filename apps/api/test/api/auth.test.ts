import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { loadConfig } from "../../src/config.ts";
import { resetDatabase, setupTestApp } from "./helpers.ts";

let ctx: Awaited<ReturnType<typeof setupTestApp>>;
// Browsers send Origin on these POSTs; better-auth checks it against baseURL.
const origin = loadConfig(process.env).auth.baseURL;
const credentials = { name: "Ada Lovelace", email: "ada@example.com", password: "correct-horse-battery" };

beforeAll(async () => {
  ctx = await setupTestApp();
});
beforeEach(async () => {
  await resetDatabase(ctx.dataSource);
});
afterAll(async () => {
  await ctx.dataSource.destroy();
});

function signUp(body: object = credentials) {
  return request(ctx.app).post("/api/auth/sign-up/email").set("Origin", origin).send(body);
}

function signIn(body: object) {
  return request(ctx.app).post("/api/auth/sign-in/email").set("Origin", origin).send(body);
}

function sessionCookie(res: request.Response): string {
  const cookies = ([] as string[]).concat(res.headers["set-cookie"] ?? []);
  const cookie = cookies.find((c) => c.startsWith("better-auth.session_token="));
  if (!cookie) throw new Error(`no session cookie in ${JSON.stringify(cookies)}`);
  return cookie.split(";")[0]!;
}

describe("email + password auth", () => {
  it("auth: sign-up creates a user, stores a hashed password and sets a session cookie", async () => {
    const res = await signUp();
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ name: credentials.name, email: credentials.email });
    expect(sessionCookie(res)).toBeTruthy();

    const [account] = await ctx.dataSource.query(
      `SELECT "providerId", "password" FROM "account"`,
    );
    expect(account.providerId).toBe("credential");
    expect(account.password).not.toBe(credentials.password);
  });

  it("auth: sign-up rejects an email that is already registered", async () => {
    await signUp();
    const res = await signUp();
    expect(res.status).toBe(422);
  });

  it("auth: sign-up rejects a password shorter than 8 characters", async () => {
    const res = await signUp({ ...credentials, password: "short" });
    expect(res.status).toBe(400);
  });

  it("auth: sign-in with the right password returns the user and a session cookie", async () => {
    await signUp();
    const res = await signIn({ email: credentials.email, password: credentials.password });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(credentials.email);
    expect(sessionCookie(res)).toBeTruthy();
  });

  it("auth: sign-in with a wrong password is rejected", async () => {
    await signUp();
    const res = await signIn({ email: credentials.email, password: "wrong-password" });
    expect(res.status).toBe(401);
  });

  it("auth: get-session returns the signed-in user", async () => {
    const cookie = sessionCookie(await signUp());
    const res = await request(ctx.app).get("/api/auth/get-session").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(credentials.email);
  });

  it("auth: sign-out ends the session", async () => {
    const cookie = sessionCookie(await signUp());
    const out = await request(ctx.app)
      .post("/api/auth/sign-out")
      .set("Origin", origin)
      .set("Cookie", cookie);
    expect(out.status).toBe(200);

    const me = await request(ctx.app).get("/api/me").set("Cookie", cookie);
    expect(me.status).toBe(401);
  });
});

describe("GET /api/me (requireAuth)", () => {
  it("auth: returns 401 JSON without a session", async () => {
    const res = await request(ctx.app).get("/api/me");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized" });
  });

  it("auth: returns the current user with a valid session", async () => {
    const cookie = sessionCookie(await signUp());
    const res = await request(ctx.app).get("/api/me").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ name: credentials.name, email: credentials.email });
  });
});
