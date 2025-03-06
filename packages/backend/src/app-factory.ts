import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifySensible from "@fastify/sensible";
import {
  TypeBoxTypeProvider,
  TypeBoxValidatorCompiler,
} from "@fastify/type-provider-typebox";
import fastifyCookie from "@fastify/cookie";
import fastifyAuth from "@fastify/auth";
import fastifyCors from "@fastify/cors";

import mikroOrmPlugin from "./plugins/mikro-orm.plugin.ts";
import root from "./services/root.ts";
import UserRepo from "./repository/User.repo.ts";
import authPlugin from "./services/auth/auth.plugin.ts";
import cacheManager from "./plugins/cache-manager/index.ts";
import vineValidator from "./plugins/vine-validator/index.ts";
import i18n from "./i18n/index.ts";
import UserSessionRepo from "./repository/User-Session.repo.ts";
import appConfig from "./configs/index.ts";
import smsProvider from "./plugins/sms-provider/index.ts";
import userGuardHook from "./hooks/user-guard.hook.ts";
import userPlugin from "./services/user/user.plugin.ts";
import adminPlugin from "./services/admin/admin.plugin.ts";
import AdminRepo from "./repository/Admin.repo.ts";
import AdminSessionRepo from "./repository/Admin-Session.repo.ts";
import currencyPlugin from "./services/currency/currency.plugin.ts";
import CurrencyPriceRepo from "./repository/Currency-Price.repo.ts";
import CurrencyTypeRepo from "./repository/Currency-Type.repo.ts";
import WalletTransactionRepo from "./repository/Wallet-Transaction.repo.ts";
import WalletRepo from "./repository/Wallet.repo.ts";
import "./schema/index.ts";

export default function appFactory() {
  const app = Fastify({ logger: true })
    .setValidatorCompiler(TypeBoxValidatorCompiler)
    .withTypeProvider<TypeBoxTypeProvider>()

    .register(appConfig)
    .register(i18n)
    .register(fastifyJwt, { secret: "verySecret" })
    .register(fastifySensible)
    .register(fastifyCookie, { secret: "verySecretKey" })
    .register(fastifyAuth)
    .register(fastifyCors, {
      origin: "http://localhost:5173",
      credentials: true,
    })
    .register(userGuardHook)
    .register(vineValidator)
    .register(cacheManager)
    .register(mikroOrmPlugin)
    .register(smsProvider)
    .register(root)
    .register(UserRepo)
    .register(AdminRepo)
    .register(UserSessionRepo)
    .register(AdminSessionRepo)
    .register(CurrencyPriceRepo)
    .register(CurrencyTypeRepo)
    .register(WalletTransactionRepo)
    .register(WalletRepo)
    .register(authPlugin, { prefix: "auth" })
    .register(userPlugin, { prefix: "user" })
    .register(adminPlugin, { prefix: "admin" })
    .register(currencyPlugin, { prefix: "currency" });

  app.addHook("onRequest", (req, _, done) => {
    console.log("-".repeat(10));
    console.log("cookie:", req.cookies);
    console.log("-".repeat(10));

    done();
  });
  return app;
}
