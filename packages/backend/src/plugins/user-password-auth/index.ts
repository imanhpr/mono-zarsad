import { RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import {
  IUserPasswordAuthRequestBodySchema,
  UserPasswordAuthRequestBodySchema,
} from "./schema.ts";
import { EntityClass, EntityManager } from "@mikro-orm/core";
import { type PasswordService } from "../password/index.ts";
import { type JWT } from "@fastify/jwt";
import AdminSession from "../../models/Admin-Session.entity.js";
import type UserSession from "../../models/User-Session.entity.ts";
import * as luxon from "luxon";
import { SessionRepo } from "../../repository/Session.repo.ts";
import vine from "@vinejs/vine";

type Session = typeof AdminSession | typeof UserSession;
interface AuthRequestBody extends RequestGenericInterface {
  Body: IUserPasswordAuthRequestBodySchema;
}
interface IAuthInput {
  username: string;
  password: string;
}
type UserPassAuthAbleEntity = EntityClass<{
  username: string;
  password: string;
}>;
const schema = { schema: { body: UserPasswordAuthRequestBodySchema } };

class UserPasswordAuthService {
  #em: EntityManager;
  #entityCls: UserPassAuthAbleEntity;
  #passwordService: PasswordService;
  #jwtSign: JWT["sign"];
  #sessionRepo: SessionRepo;
  constructor(
    em: EntityManager,
    entityCls: UserPassAuthAbleEntity,
    passwordService: PasswordService,
    jwt: JWT["sign"],
    sessionRepo: SessionRepo
  ) {
    this.#em = em;
    this.#entityCls = entityCls;
    this.#passwordService = passwordService;
    this.#jwtSign = jwt;
    this.#sessionRepo = sessionRepo;
  }

  async login({ password, username }: IAuthInput) {
    const user = await this.#em.findOneOrFail(this.#entityCls, { username });
    const passwordCompareResult = await this.#passwordService.compare(
      password,
      user.password
    );
    if (passwordCompareResult === false)
      throw new Error("نام کاربری یا پسورد مشکل دارد.");
    // Use async sign method
    const newSession = await this.#sessionRepo.createNew(user.id);
    const token = this.#jwtSign({ id: user.id });
    return { token, newSession };
  }

  async logout(sid: string) {
    const session = await this.#sessionRepo.findOne(sid);
    if (session === null) throw new Error("session not found");
    const now = luxon.DateTime.now();
    const expireAt = luxon.DateTime.fromJSDate(session.expireAt);

    if (now >= expireAt) {
      throw new Error("Invalid Token");
    }
    return this.#sessionRepo.expireById(sid);
  }
}

export default fp<{ entityRef: UserPassAuthAbleEntity; sessionRef: Session }>(
  function userPasswordAuthPlugin(fastify, config, done) {
    const sessionIdVineValidationSchema = vine.string().uuid({ version: [4] });

    const hasPasswordService = fastify.hasDecorator("passwordService");
    const hasOrm = fastify.hasDecorator("orm");
    const hasJwt = fastify.hasDecorator("jwt");
    const hasAdminSessionRepo = fastify.hasDecorator("adminSessionRepo");

    if (!hasPasswordService)
      throw new Error("Please init passwordServicePlugin");
    if (!hasOrm) throw new Error("Please init mikro-orm plugin");
    if (!hasJwt) throw new Error("Please init @fastify/jwt service");
    if (!hasAdminSessionRepo) throw new Error("Please init AdminSessionRepo");

    const service = new UserPasswordAuthService(
      fastify.orm.em,
      config.entityRef,
      fastify.passwordService,
      fastify.jwt.sign,
      fastify.adminSessionRepo
    );
    fastify.post<AuthRequestBody>(
      "/auth/login",
      schema,
      async function AdminLoginHandler(req, rep) {
        const { newSession, token } = await service.login(req.body);
        rep
          .setCookie("session-id", newSession.id, { path: "/admin/auth" })
          .send({ token });
      }
    );

    fastify.get(
      "/auth/logout",
      {
        preHandler: async function vineSessionIdValidation(req) {
          await fastify.vineValidator(
            sessionIdVineValidationSchema,
            req.cookies["session-id"]
          );
        },
      },
      async function AdminLogoutHandler(req, rep) {
        // TODO: Type safety
        const sid = req.cookies["session-id"]!;
        await service.logout(sid);
        rep
          .clearCookie("session-id", { path: "/admin/auth" })
          .send({ result: "ok" });
      }
    );

    done();
  },

  { name: "userPasswordAuthPlugin" }
);
