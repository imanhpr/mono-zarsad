import fp from "fastify-plugin";
import vine from "@vinejs/vine";
import { type ConstructableSchema } from "@vinejs/vine/types";

async function vineValidator<
  T extends ConstructableSchema<unknown, unknown, unknown>
>(schema: T, data: unknown) {
  const result = await vine.validate({ schema, data });
  return result;
}

export default fp(
  function vineValidatorPlugin(fastify, _, done) {
    fastify.decorate(vineValidator.name, vineValidator);
    done();
  },
  {
    name: " vineValidatorPlugin",
  }
);

declare module "fastify" {
  interface FastifyInstance {
    vineValidator: typeof vineValidator;
  }
}
