import { createAuthClient } from "better-auth/react";

/** better-auth client. Same origin: calls go to /api/auth/*, which Vite proxies to the API. */
export const authClient = createAuthClient();

export const { useSession, signIn, signUp, signOut } = authClient;
