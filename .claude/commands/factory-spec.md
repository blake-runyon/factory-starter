---
description: "Stage 1: interview the human and draft factory/spec.md"
argument-hint: "[short description of the idea]"
---
You are running **Stage 1 (Spec)** of the Software Factory. Idea: $ARGUMENTS

1. Read `factory/spec.md`. If its `status` is `approved`, stop: tell the human the spec
   is locked and they must set `status: draft` to reopen it.
2. Interview the human. Ask in small batches (at most 4 questions at a time) about:
   problem and users, roles and auth, core features, data, screens, constraints, non-goals.
   Prefer concrete options with a recommended default. Do not invent requirements.
3. Write `factory/spec.md` using its existing structure:
   - Every feature has acceptance criteria in Given/When/Then form with ids (`AC<feature>.<n>`).
   - Each AC is observable and testable, and is tagged with a proposed test layer
     (`ui-e2e`, `api-e2e`, or `unit`).
   - Anything unresolved goes under "Open questions". Do not guess.
4. Leave `status: draft`. Never approve it yourself.
5. Finish with a short summary: feature count, AC count, open questions. Then say:

   > **Gate 1:** Review `factory/spec.md`. Edit anything you like. When satisfied, run
   > `factory/bin/approve factory/spec.md`, then `/factory-plan`.
