# Entities

One TypeORM entity per file, **registered in `index.ts`** (no globs; see the comment there).

Rules (the dev and test runners strip type metadata, so TypeORM cannot infer types):
- Always give every column an explicit type: `@Column({ type: "varchar", length: 200 })`.
- Wrap relation property types in `Relation<>` to avoid ESM circular-import issues:
  `@ManyToOne(() => User) owner: Relation<User>;`
- Never enable `synchronize`. After changing an entity, generate a migration:
  `npm -w apps/api run migration:generate -- src/migrations/<Name>`
  then review the generated SQL before committing it.
