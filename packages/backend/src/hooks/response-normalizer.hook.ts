import fp from "fastify-plugin";
import { BusinessOperationResult } from "../helpers/index.ts";
import phoneNumberValidationHook from "./phoneNumber-validation.hook.ts";

export default fp(async function responseNormalizerHookPlugin(fastify) {
  fastify.addHook(
    "preSerialization",
    async function responseNormalizer(_, __, payload) {
      if (payload instanceof BusinessOperationResult) return payload;

      return payload;
      //   throw new Error("Unknown Response Call Server Admin");
    }
  );
});
