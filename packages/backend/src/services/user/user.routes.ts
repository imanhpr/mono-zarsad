import { FastifyInstance } from "fastify";
import meGetPlugin from "./routes/me-get.plugin.ts";

export default function userRoutesPlugin(
  fastify: FastifyInstance,
  _: Record<string, unknown>,
  done: (err?: Error) => void
) {
  fastify.register(meGetPlugin);
  done();
}
