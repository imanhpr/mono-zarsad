import { FastifyInstance } from "fastify";
import type User from "../../models/User.entity.ts";
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

import "@fastify/jwt";
import logOutGetPlugin from "./routes/logout/logout-get.plugin.ts";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: User; // user type is return type of `request.user` object
  }
}
