import type { DataSourceOptions } from "typeorm";

/**
 * Every entity must be listed here. (Explicit imports, not a glob: a glob makes TypeORM
 * load a second copy of each class under test runners, breaking getRepository(Entity).)
 */
export const entities: NonNullable<DataSourceOptions["entities"]> = [];
