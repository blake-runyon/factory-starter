import { fromNodeHeaders } from "better-auth/node";
import type { RequestHandler } from "express";
import type { Auth } from "./auth.ts";

type Session = NonNullable<Awaited<ReturnType<Auth["api"]["getSession"]>>>;

declare module "express-serve-static-core" {
  interface Locals {
    /** Set by requireAuth on authenticated requests. */
    session?: Session;
  }
}

/** Express middleware: 401 unless the request has a valid session; puts it on res.locals.session. */
export function requireAuth(auth: Auth): RequestHandler {
  return async (req, res, next) => {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.locals.session = session;
    next();
  };
}
