# {{PROJECT_NAME}} — built by the Software Factory

This project is produced through a staged, human-in-the-loop process.
Stage artifacts live in `factory/`. Follow these rules in every session.

## Stack (do not deviate without human approval)
- Frontend `apps/web`: Vite, React, TypeScript, Tailwind CSS v4, shadcn/ui
- Backend `apps/api`: Node.js, Express 5, TypeScript, TypeORM
- Database: PostgreSQL 17 via `docker compose` (dev DB `app`, test DB `app_test`)
- Tests: Vitest (unit), Vitest + Supertest against real Postgres (API e2e), Playwright (UI e2e)
- npm workspaces monorepo; run commands from the repo root

## Commands
| Command | What it does |
|---|---|
| `npm run setup` | Install deps + Playwright Chromium (first time) |
| `npm run dev` | Start Postgres, API (:3000) and web (:5173, proxies `/api`) |
| `npm run verify` | **The gate:** lint → typecheck → unit → API e2e → Playwright e2e |
| `npm run test:unit` / `test:api` / `test:e2e` | One test layer |
| `npm -w apps/api run migration:generate -- src/migrations/<Name>` | Generate a migration from entity changes |
| `npx shadcn@latest add <component>` (run in `apps/web`) | Add a shadcn/ui component |

## Code conventions
- **API:** `createApp(dataSource)` in `apps/api/src/app.ts` builds the app; add feature
  routers there. Routes live under `/api/*`. Errors return JSON `{ error: string }`.
- **Auth:** better-auth (email + password), built in `apps/api/src/auth.ts` and mounted at
  `/api/auth/*`. Protect routes with `requireAuth(auth)` (session on `res.locals.session`).
  Its tables (`user`, `session`, `account`, `verification`) come from a migration, not entities.
  Web: `@/lib/auth-client` (`useSession`, `signIn`, `signUp`, `signOut`); wrap protected
  routes in `<RequireAuth>`.
- **Entities:** one per file in `apps/api/src/entities/`, registered in `entities/index.ts`.
  Every `@Column` needs an explicit `type`. Wrap relation types in `Relation<>`.
  See `apps/api/src/entities/README.md`.
- **Schema changes go through migrations only.** Never enable `synchronize`. Review the
  generated SQL. A migration that drops data needs a note in the task's build report.
- **Web:** use shadcn/ui components and Tailwind classes. Use `@/` imports. Call the API with
  relative `/api/...` URLs. Give elements accessible roles/labels so Playwright can find them
  by role; use `data-testid` only when there is no good role.
- **Tests:** API tests use `setupTestApp()` and `resetDatabase()` from `apps/api/test/api/helpers.ts`.
  Playwright starts its own API (:3101) and web (:5174) servers against the test DB.

## Gates — hard rules
- Never set any artifact's `status` to `approved` or `done`, and never edit
  `approved_by` / `approved_on`. Only the human does that, via `factory/bin/approve`.
- Never merge, push, or commit on `main`. Commit only on the current `task/*` branch.
- Before building anything, confirm `factory/spec.md` and `factory/plan.md` are `approved`.
- Work on exactly one task at a time, within that task's stated scope.
- If something is ambiguous or the plan seems wrong, stop and ask. Record the
  question under "Open questions" in the relevant artifact.

## Testing — hard rules
- Every acceptance criterion maps to a test that includes its AC id in the test name.
- Never skip, delete, or weaken a test to get `verify` green. Report failures honestly.
- API e2e tests hit the real Postgres test database, not mocks.
- A task may move to `ready-for-review` only after `npm run verify` passes.
- The `starter:` tests are the skeleton's smoke tests. Keep them passing; update them only
  if a task deliberately replaces the starter page or health endpoint.

## Stage commands (from the `factory` Claude Code plugin)
`/factory:spec`, `/factory:plan`, `/factory:build NNN`, `/factory:review NNN`, `/factory:status`.
The plugin also enforces the gates: Claude cannot approve artifacts, edit approved ones,
run `factory/bin/approve`, or `git push` / `merge` / `rebase`.
