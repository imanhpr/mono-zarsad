import process from "node:process";
import appFactory from "./app-factory.ts";
import { BusinessOperationException } from "./exceptions/index.ts";
import { BusinessOperationResult } from "./helpers/index.ts";
import {
  DriverException,
  UniqueConstraintViolationException,
} from "@mikro-orm/core";
const app = appFactory();
UniqueConstraintViolationException;
app.setErrorHandler(function exceptHandler(err, _, rep) {
  if (err instanceof BusinessOperationException) {
    rep
      .code(err.httpCode)
      .send(new BusinessOperationResult("failed", err.message, err.input));
    return;
  }
  if (err instanceof DriverException) {
    rep
      .code(500)
      .send({ message: "Internal Server Error - Please Call Server Admin" });
    return;
  }

  if (err.code === "FST_ERR_VALIDATION") {
    const SCHEMA_VALIDATION_ERROR = "SCHEMA_VALIDATION_ERROR";
    rep.code(400).send(
      new BusinessOperationResult("failed", SCHEMA_VALIDATION_ERROR, {
        message: err.message,
      })
    );
    return;
  }
  return err;
});
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
