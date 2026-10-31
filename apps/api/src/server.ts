import { createApp } from "./app.ts";
import { loadConfig, loadRootEnvFile } from "./config.ts";
import { createDataSource } from "./data-source.ts";

loadRootEnvFile();
const config = loadConfig(process.env);
const dataSource = createDataSource(config.db);

await dataSource.initialize();
await dataSource.runMigrations();

const server = createApp(dataSource).listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port} (db: ${config.db.database})`);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    server.close();
    void dataSource.destroy().finally(() => process.exit(0));
  });
}
