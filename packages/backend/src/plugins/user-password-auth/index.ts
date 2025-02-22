import { RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import {
  IUserPasswordAuthRequestBodySchema,
  UserPasswordAuthRequestBodySchema,
} from "./schema.ts";
import { EntityClass, EntityManager } from "@mikro-orm/core";
import { type PasswordService } from "../password/index.ts";
import { type JWT } from "@fastify/jwt";

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

  constructor(
    em: EntityManager,
    entityCls: UserPassAuthAbleEntity,
    passwordService: PasswordService,
    jwt: JWT["sign"]
  ) {
    this.#em = em;
    this.#entityCls = entityCls;
    this.#passwordService = passwordService;
    this.#jwtSign = jwt;
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
    const token = this.#jwtSign({ id: user.id });
    return { token };
  }
}

export default fp<{ entityRef: UserPassAuthAbleEntity }>(
  function userPasswordAuthPlugin(fastify, config, done) {
    const hasPasswordService = fastify.hasDecorator("passwordService");
    const hasOrm = fastify.hasDecorator("orm");
    const hasJwt = fastify.hasDecorator("jwt");

    if (!hasPasswordService)
      throw new Error("Please init passwordServicePlugin");
    if (!hasOrm) throw new Error("Please init mikro-orm plugin");
    if (!hasJwt) throw new Error("Please init @fastify/jwt service");

    const service = new UserPasswordAuthService(
      fastify.orm.em,
      config.entityRef,
      fastify.passwordService,
      fastify.jwt.sign
    );
    fastify.post<AuthRequestBody>(
      "/auth/login",
      schema,
      async function AdminLoginHandler(req) {
        const authResult = await service.login(req.body);

        return authResult;
      }
    );

    done();
  },

  { name: "userPasswordAuthPlugin" }
);
