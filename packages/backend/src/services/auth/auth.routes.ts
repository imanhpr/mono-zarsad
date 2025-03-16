import { FastifyInstance } from "fastify";
import logOutGetPlugin from "./routes/logout/logout-get.plugin.ts";

import {
  loginPostPlugin,
  refreshTokenGetPlugin,
  registerPostPlugin,
  verifyPostPlugin,
} from "./routes/index.ts";

export default function authRoutesPlugin(
  fastify: FastifyInstance,
  _: Record<string, unknown>,
  done: (err?: Error) => void
) {
  const hasAuthService = fastify.hasDecorator("authService");
  const hasVineValidator = fastify.hasDecorator("vineValidator");
  if (!hasAuthService) throw new Error("Please init authService decorator");
  if (!hasVineValidator) throw new Error("Please init vineValidator");

  fastify
    .register(registerPostPlugin)
    .register(loginPostPlugin)
    .register(verifyPostPlugin)
    .register(refreshTokenGetPlugin)
    .register(logOutGetPlugin);

  done();
}
