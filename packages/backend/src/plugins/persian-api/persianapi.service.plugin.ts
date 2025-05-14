import fp from "fastify-plugin";
import axios, { type AxiosInstance } from "axios";
import vine from "@vinejs/vine";
import {
  type IMeltedGoldGetResponseSchema,
  MeltedGoldGetResponseSchema,
} from "./schema.ts";

const BEARER_TOKEN = "Bearer 4d6m3h1finwuqvkpwmfc";
const MELTED_GOLD_URL =
  "https://studio.persianapi.com/web-service/list/melted-gold";

export class PersianApiService {
  #ax: AxiosInstance;
  constructor(ax: AxiosInstance) {
    this.#ax = ax;
  }
  async getMeltedGoldPrice(): Promise<IMeltedGoldGetResponseSchema> {
    const response = await this.#ax.get(MELTED_GOLD_URL);
    const result = await vine.validate({
      data: response.data,
      schema: MeltedGoldGetResponseSchema,
    });
    return result;
  }
}

export default fp(async function persianApiServicePlugin(fastify) {
  const ax = axios.create();
  ax.defaults.headers["Authorization"] = BEARER_TOKEN;
  const persianApiService = new PersianApiService(ax);
  fastify.decorate("persianApiService", persianApiService);
});

declare module "fastify" {
  export interface FastifyInstance {
    persianApiService: InstanceType<typeof PersianApiService>;
  }
}
