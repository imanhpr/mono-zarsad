import fp from "fastify-plugin";
import { Queue, Worker } from "bullmq";
import * as luxon from "luxon";
import process from "node:process";
import { CronService } from "./worker.service.ts";
import { EntityManager } from "@mikro-orm/postgresql";

export default fp(
  async function WorkerServicePlugin(fastify) {
    const persianApiService = fastify.persianApiService;
    const cronService = new CronService(
      fastify.currencyPriceRepo,
      fastify.currencyTypeRepo,
      fastify.orm.em as EntityManager
    );
    await cronService.init();
    const TIME = luxon.Duration.fromObject({ seconds: 5 }).toMillis();

    const MELTED_GOLD_CRON = new Queue("MELTED_GOLD_CRON_QUEUE", {
      connection: fastify.redis,
    });

    await MELTED_GOLD_CRON.upsertJobScheduler(
      "MELTED_GOLD_PRICE_GET",
      {
        every: TIME,
      },
      { name: "MELTED_GOLD_PRICE_GET_JOB" }
    );

    const MELTED_GOLD_WORKER = new Worker(
      MELTED_GOLD_CRON.name,
      async function meltedGoldCronWorker(job) {
        try {
          const response = await persianApiService.getMeltedGoldPrice();
          await cronService.insertNewMeltedGoldPrice(response);

          fastify.log.debug("Melted Gold Price Get Was successful");
        } catch (err) {
          fastify.log.error("We have a error on melted gold cron");
          fastify.log.error(err);
          throw err;
        } finally {
        }
      },
      { connection: fastify.redis }
    );
    process.on("exit", async () => {
      fastify.log.info("Try to close MELTED_GOLD_CRON_JOB on exit");
      await MELTED_GOLD_WORKER.close();
    });

    process.on("SIGINT", async () => {
      fastify.log.info("Try to close MELTED_GOLD_CRON_JOB on SIGINT");
      await MELTED_GOLD_WORKER.close();
    });
  },

  {
    name: "WorkerServicePlugin",
    decorators: {
      fastify: [
        "redis",
        "persianApiService",
        "currencyPriceRepo",
        "currencyTypeRepo",
        "orm",
      ],
    },
  }
);
