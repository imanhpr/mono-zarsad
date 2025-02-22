import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifySensible from "@fastify/sensible";
import {
  Type,
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
import SessionRepo from "./repository/Session.repo.ts";
import appConfig from "./configs/index.ts";
import smsProvider from "./plugins/sms-provider/index.ts";
import userGuardHook from "./hooks/user-guard.hook.ts";
import userPlugin from "./services/user/user.plugin.ts";
import crudServiceFactoryPlugin from "./plugins/crud-service/index.ts";
import Admin from "./models/Admin.entity.ts";
import passwordServicePlugin from "./plugins/password/index.ts";
import adminPlugin from "./services/admin/admin.plugin.ts";
import AdminRepo from "./repository/Admin.repo.ts";
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
    .register(crudServiceFactoryPlugin)
    .register(userGuardHook)
    .register(vineValidator)
    .register(cacheManager)
    .register(mikroOrmPlugin)
    .register(smsProvider)
    .register(root)
    .register(UserRepo)
    .register(SessionRepo)
    .register(AdminRepo)
    .register(authPlugin, { prefix: "auth" })
    .register(userPlugin, { prefix: "user" })
    .register(adminPlugin, { prefix: "admin" })
    .register(function (fastify, _, done) {
      const plugin = fastify.crudFactory(Admin);
      fastify.register(plugin);
      done();
    });

  app.addHook("onRequest", (req, _, done) => {
    console.log("-".repeat(10));
    console.log("cookie:", req.cookies);
    console.log("-".repeat(10));

    done();
  });
  return app;
}
