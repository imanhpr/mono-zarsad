import { FastifyPluginCallback } from "fastify";

export type SyncDoneFn = Parameters<FastifyPluginCallback>["2"];
