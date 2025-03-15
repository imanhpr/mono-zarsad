import { FastifyInstance } from "fastify";
import userPasswordAuth from "../../plugins/user-password-auth/index.ts";
import Admin from "../../models/Admin.entity.ts";
import passwordServicePlugin from "../../plugins/password/index.ts";
import AdminSession from "../../models/Admin-Session.entity.ts";
import createUserPostPlugin from "./routes/user/create-user-post.ts";
import getLatestUsersPlugin from "./routes/user/latest-users-get.ts";
import deleteUserPlugin from "./routes/user/delete-user.ts";
import updateUserPutPlugin from "./routes/user/update-user-put.ts";
import getUserByFilterPlugin from "./routes/user/users-filter-get.ts";

export default function adminRoutesPlugin(
  fastify: FastifyInstance,
  _: Record<string, unknown>,
  done: (err?: Error) => void
) {
  const config = { prefix: "user" };

  fastify
    .register(passwordServicePlugin)
    .register(userPasswordAuth, {
      entityRef: Admin,
      sessionRef: AdminSession,
    })
    .register(createUserPostPlugin, config)
    .register(getLatestUsersPlugin, config)
    .register(deleteUserPlugin, config)
    .register(updateUserPutPlugin, config)
    .register(getUserByFilterPlugin, config);
  done();
}
