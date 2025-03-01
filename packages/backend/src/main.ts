import process from "node:process";
import appFactory from "./app-factory.ts";
const app = appFactory();
try {
  await app.listen({ port: 3000 });
} catch (err) {
  app.log.fatal(err);
  process.exit(1);
}
