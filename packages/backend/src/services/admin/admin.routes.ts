import { FastifyInstance } from "fastify";
import createUserPostPlugin from "./routes/user/create-user-post.ts";
import deleteUserPlugin from "./routes/user/delete-user.ts";
import updateUserPutPlugin from "./routes/user/update-user-put.ts";
import getUserByFilterPlugin from "./routes/user/users-filter-get.ts";
import adminMeGetPlugin from "./routes/auth/me-get.ts";
import adminGurdHook from "../../hooks/admin-gurd-hook.ts";
import getUserTransactionsPlugin from "./routes/transaction/get-user-transaction.ts";
import finalizeTransactionPostPlugin from "./routes/transaction/finalize-transaction-post.plugin.ts";
import adminAuthLoginPostPlugin from "./routes/auth/login-post.plugin.ts";
import adminRefreshTokenGetPlugin from "./routes/auth/refresh-get.plugin.ts";
import dashboardPageGetPlugin from "./routes/page/dashboard-get.plugin.ts";
import getLatestCurrencyByTypeIdPlugin from "./routes/currency/currency.get.route.ts";
import getCurrentActiveSpreadPlugin from "./routes/spread/active-spread.get.route.ts";
import getUserListByFilterRoutePlugin from "./routes/user/get-user-list-by-filter.plugin.route.ts";
import transactionHistoryGetPlugin from "./routes/transaction/transaction-history.get.plugin.ts";
import createSimpleTransactionPostPlugin from "./routes/transaction/create-simple-transaction.post.plugin.ts";
import createExchangeTransactionPostPlugin from "./routes/transaction/create-exchange-transaction.post.plugin.ts";

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
    .register(getUserListByFilterRoutePlugin, config)
    .register(deleteUserPlugin, config)
    .register(updateUserPutPlugin, config)
    .register(getUserByFilterPlugin, config)
    .register(adminMeGetPlugin, authPrefix)
    .register(transactionHistoryGetPlugin)
    .register(createSimpleTransactionPostPlugin)
    .register(createExchangeTransactionPostPlugin)
    .register(getUserTransactionsPlugin)
    .register(finalizeTransactionPostPlugin)
    .register(dashboardPageGetPlugin, { prefix: "page" })
    .register(getLatestCurrencyByTypeIdPlugin, { prefix: "currency" })
    .register(getCurrentActiveSpreadPlugin, { prefix: "spread" });
  done();
}
