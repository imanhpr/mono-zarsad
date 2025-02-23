import { FastifyInstance } from "fastify";
import userPasswordAuth from "../../plugins/user-password-auth/index.ts";
import Admin from "../../models/Admin.entity.ts";
import passwordServicePlugin from "../../plugins/password/index.ts";
import AdminSession from "../../models/Admin-Session.entity.ts";

export default function adminRoutesPlugin(
  fastify: FastifyInstance,
  _: Record<string, unknown>,
  done: (err?: Error) => void
) {
  fastify.register(passwordServicePlugin).register(userPasswordAuth, {
    entityRef: Admin,
    sessionRef: AdminSession,
  });
  done();
}
