import fp from "fastify-plugin";
import { BusinessOperationException } from "../exceptions/index.ts";

export default fp(
  async function simpleResponseCache(fastify) {
    const redis = fastify.redis;
    const cacheHeaderKey = "x-cache";

    const cacheKeyFactory = (sid: string) => `SID_CACHE:${sid}`;
    fastify.addHook(
      "preHandler",
      async function onRequestCookieCacheCheck(req, rep) {
        const sid = req.cookies["session-id"];

        rep.header(cacheHeaderKey, "miss");

        if (!sid) return;
        const unsignSid = req.unsignCookie(sid);
        if (!unsignSid.valid) return rep.unauthorized("Invalid cookie.");
        const key = cacheKeyFactory(unsignSid.value);

        const cacheResult = await redis.get(key);
        if (!cacheResult) return;
        return rep
          .headers({
            [cacheHeaderKey]: "hit",
            "content-type": "application/json",
            "content-length": cacheResult.length,
          })
          .send(cacheResult);
      }
    );
    // fastify.addHook(
    //   "onSend",
    //   async function onSendCookieCacheSet(req, rep, payload) {
    //     if (!rep.cacheKey) {
    //       req.log.error(
    //         { pluginName: fastify.pluginName },
    //         "Please set rep.cacheKey for this plugin"
    //       );
    //       throw new BusinessOperationException(500, "Internal Server Error");
    //     }
    //     const key = cacheKeyFactory(rep.cacheKey);
    //     await redis.setex(key, 120, JSON.stringify(payload));
    //     return payload;
    //   }
    // );
  },
  {
    name: "simpleResponseCache",
    decorators: {
      fastify: ["redis"],
      request: ["cookies"],
      reply: ["cacheKey"],
    },
  }
);

declare module "fastify" {
  export interface FastifyReply {
    cacheKey?: string;
  }
}
