import process from "node:process";
import appFactory from "./app-factory.ts";
const app = appFactory();
try {
  await app.ready();
  await app.listen({ port: app.appConfig.APP_PORT, host: "0.0.0.0" });
} catch (err) {
  app.log.fatal(err);
  process.exit(1);
}

process.on("SIGINT", () => {
  app.log.info("SIGINT CLOSE");
  process.exit(0);
});
