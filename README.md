# factory-starter

The starting point for every app built by the Software Factory: a working, fully tested
full-stack skeleton plus the factory's human-in-the-loop workflow for Claude Code.

**Stack:** Vite · React · TypeScript · Tailwind CSS v4 · shadcn/ui · Node.js · Express 5 ·
TypeORM · PostgreSQL 17 (Docker) · Vitest · Supertest · Playwright

## Quick start

Requires Node.js 22+ and Docker.

```bash
npm run setup     # install dependencies + Playwright Chromium
npm run dev       # Postgres + API on :3000 + web on :5173
npm run verify    # lint, typecheck, unit, API e2e, Playwright e2e
```

Copy `.env.example` to `.env` to change ports or database credentials.

## Layout

```
apps/
  api/            Express + TypeORM
    src/          app.ts, server.ts, data-source.ts, entities/, migrations/
    test/unit/    Vitest unit tests
    test/api/     Supertest API tests against the real test database
  web/            Vite + React + Tailwind + shadcn/ui
    src/          App.tsx, components/ui/, lib/
    e2e/          Playwright tests (start their own servers on :3101 / :5174)
docker-compose.yml   Postgres (creates app and app_test databases)
factory/          spec, plan and task artifacts + bin/approve
.claude/          factory stage commands and permission guardrails
CLAUDE.md         rules Claude Code follows in this project
```

## The factory workflow

| Step | Command | You do (gate) |
|---|---|---|
| Spec | `/factory-spec <idea>` | Review `factory/spec.md`, then `factory/bin/approve factory/spec.md` |
| Plan | `/factory-plan` | Review plan + tasks, then `factory/bin/approve factory/plan.md` |
| Build | `/factory-build 001` | Review the branch diff, approve the task, merge it yourself |
| Review | `/factory-review 001` | Optional independent review before you decide |
| Status | `/factory-status` | Shows the next action |

Claude is not allowed to approve artifacts, merge, or push. Those steps stay with you.
