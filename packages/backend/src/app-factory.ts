import Fastify, { FastifyBaseLogger } from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifySensible from "@fastify/sensible";
import {
  TypeBoxTypeProvider,
  TypeBoxValidatorCompiler,
} from "@fastify/type-provider-typebox";
import fastifyCookie from "@fastify/cookie";
import fastifyAuth from "@fastify/auth";
import fastifyCors from "@fastify/cors";
import fastifyReqContext from "@fastify/request-context";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifySwagger from "@fastify/swagger";

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
import AdminSessionRepoPlugin from "./repository/Admin-Session.repo.ts";
import currencyPlugin from "./services/currency/currency.plugin.ts";
import CurrencyPriceRepo from "./repository/Currency-Price.repo.ts";
import CurrencyTypeRepo from "./repository/Currency-Type.repo.ts";
import WalletAudiRepo from "./repository/Wallet-Audit.repo.ts";
import WalletRepo from "./repository/Wallet.repo.ts";
import "./schema/index.ts";
import type User from "./models/User.entity.ts";
import type Admin from "./models/Admin.entity.ts";
import ProfileRepo from "./repository/Profile.repo.ts";
import transactionModulePlugin from "./services/transaction/index.ts";
import WalletExchangePairTransactionRepo from "./repository/WalletExchangePairTransaction.repo.ts";
import sharedServicePlugin from "./services/shared/index.ts";
import WalletTransactionRepo from "./repository/Wallet-Transaction.repo.ts";
import SimpleWalletTransactionRepo from "./repository/Simple-Wallet-Transaction.repo.ts";
import SystemInfoRepo from "./repository/System-Info.repo.ts";
import invoiceModulePlugin from "./services/invoice/invoice.plugin.ts";
import paymentModulePlugin from "./services/payment/index.ts";
import RefreshTokenRepoPlugin from "./repository/Refresh-Token.repo.ts";
import workerPlugin from "./services/workers/worker.plugin.ts";

import { randomUUID } from "node:crypto";
import passwordServicePlugin from "./plugins/password/index.ts";
import persianapiServicePlugin from "./plugins/persian-api/persianapi.service.plugin.ts";
import SpreadRepoPlugin from "./repository/Spread.repo.plugin.ts";
import PairRepo from "./repository/Pair.repo.ts";

const swaggerOptions: fastifySwagger.SwaggerOptions = {
  openapi: {
    info: {
      title: "@Zarsad/api",
      version: "3.0.0",
      summary: "All api related to the Zarsad backend",
    },
    servers: [
      {
        url: "http://localhost:3007",
        description: "local server for development",
        variables: {
          baseUrl: {
            default: "http://localhost:3007",
            description: "default base url",
          },
        },
      },
    ],
    components: {
      securitySchemes: {
        userBearerAuth: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
          description: "Bearer token for authenticate as an user",
        },

        adminBearerAuth: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
          description: "Bearer token for authenticate as an admin",
        },
      },
    },
  },
};
export default function appFactory() {
  const app = Fastify({
    requestTimeout: 4000,
    logger: {
      transport: { target: "pino-pretty" },
    },
    genReqId: () => randomUUID(),
    trustProxy: true,
  })
    .setValidatorCompiler(TypeBoxValidatorCompiler)
    .withTypeProvider<TypeBoxTypeProvider>()

    .register(appConfig)
    .register(i18n)
    .register(mikroOrmPlugin)
    .register(fastifyReqContext, {
      defaultStoreValues: (req) => ({
        reqLogger: req.log.child({
          path: req.url.toString(),
          method: req.method,
        }),
      }),
      prefix: "custom_ctx_",
    })
    .register(fastifyJwt, { secret: "verySecret" })
    .register(fastifySwagger, swaggerOptions)
    .register(fastifySwaggerUi, {
      theme: {
        title: "ZarSad-API",
      },
      routePrefix: "/documentation",
      uiConfig: {
        docExpansion: "list",
        deepLinking: false,
      },
      uiHooks: {
        onRequest: function (request, reply, next) {
          next();
        },
        preHandler: function (request, reply, next) {
          next();
        },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject;
      },
      transformSpecificationClone: true,
    })
    .register(fastifySensible)
    .register(fastifyCookie, { secret: "verySecretKey" })
    .register(fastifyAuth)
    .register(fastifyCors, {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://panel.zarcoin.top",
      ],
      credentials: true,
    })
    .register(userGuardHook)
    .register(vineValidator)
    .register(cacheManager)
    .register(smsProvider)
    .register(root)
    .register(persianapiServicePlugin)
    // Repo
    .register(UserRepo)
    .register(AdminRepo)
    .register(UserSessionRepo)
    .register(AdminSessionRepoPlugin)
    .register(CurrencyPriceRepo)
    .register(CurrencyTypeRepo)
    .register(WalletAudiRepo)
    .register(WalletTransactionRepo)
    .register(WalletRepo)
    .register(ProfileRepo)
    .register(WalletExchangePairTransactionRepo)
    .register(SimpleWalletTransactionRepo)
    .register(SystemInfoRepo)
    .register(RefreshTokenRepoPlugin)
    .register(SpreadRepoPlugin)
    .register(PairRepo)
    // Business Logics
    .register(sharedServicePlugin)
    .register(passwordServicePlugin)
    .register(authPlugin, { prefix: "auth" })
    .register(userPlugin, { prefix: "user" })
    .register(adminPlugin, { prefix: "admin" })
    .register(currencyPlugin, { prefix: "currency" })
    .register(transactionModulePlugin)
    .register(invoiceModulePlugin)
    .register(paymentModulePlugin)
    .register(workerPlugin);

  app.addHook("onRequest", (req, _, done) => {
    console.log("-".repeat(10));
    console.log("cookie:", req.cookies);
    console.log("-".repeat(10));

    done();
  });
  return app;
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: User | Omit<Admin, "password">; // user type is return type of `request.user` object
  }
}

declare module "@fastify/request-context" {
  interface RequestContextData {
    reqLogger: FastifyBaseLogger;
  }
}
