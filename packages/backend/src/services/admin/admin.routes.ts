import { FastifyInstance } from "fastify";
import passwordServicePlugin from "../../plugins/password/index.ts";
import createUserPostPlugin from "./routes/user/create-user-post.ts";
import getLatestUsersPlugin from "./routes/user/latest-users-get.ts";
import deleteUserPlugin from "./routes/user/delete-user.ts";
import updateUserPutPlugin from "./routes/user/update-user-put.ts";
import getUserByFilterPlugin from "./routes/user/users-filter-get.ts";
import adminMeGetPlugin from "./routes/auth/me-get.ts";
import adminGurdHook from "../../hooks/admin-gurd-hook.ts";
import createTransactionPostPlugin from "./routes/transaction/create-transaction-post.ts";
import getUserTransactionsPlugin from "./routes/transaction/get-user-transaction.ts";
import finalizeTransactionPostPlugin from "./routes/transaction/finalize-transaction-post.plugin.ts";
import adminAuthLoginPostPlugin from "./routes/auth/login-post.plugin.ts";
import adminRefreshTokenGetPlugin from "./routes/auth/refresh-get.plugin.ts";
import dashboardPageGetPlugin from "./routes/page/dashboard-get.plugin.ts";

export default function adminRoutesPlugin(
  fastify: FastifyInstance,
  _: Record<string, unknown>,
  done: (err?: Error) => void
) {
  const config = { prefix: "user" };
  const authPrefix = { prefix: "auth" };

  fastify
    .register(adminGurdHook)
    .register(adminAuthLoginPostPlugin, authPrefix)
    .register(adminRefreshTokenGetPlugin, authPrefix)
    .register(createUserPostPlugin, config)
    .register(getLatestUsersPlugin, config)
    .register(deleteUserPlugin, config)
    .register(updateUserPutPlugin, config)
    .register(getUserByFilterPlugin, config)
    .register(adminMeGetPlugin, authPrefix)
    .register(createTransactionPostPlugin)
    .register(getUserTransactionsPlugin)
    .register(finalizeTransactionPostPlugin)
    .register(dashboardPageGetPlugin, { prefix: "page" });
  done();
}
