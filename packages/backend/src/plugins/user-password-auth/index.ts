import { RequestGenericInterface } from "fastify";
import fp from "fastify-plugin";
import {
  IUserPasswordAuthRequestBodySchema,
  UserPasswordAuthRequestBodySchema,
} from "./schema.ts";
import { EntityClass, EntityManager } from "@mikro-orm/core";
import { type PasswordService } from "../password/index.ts";

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

  constructor(
    em: EntityManager,
    entityCls: UserPassAuthAbleEntity,
    passwordService: PasswordService
  ) {
    this.#em = em;
    this.#entityCls = entityCls;
    this.#passwordService = passwordService;
  }

  async login({ password, username }: IAuthInput) {
    const user = await this.#em.findOneOrFail(this.#entityCls, { username });
    const passwordCompareResult = await this.#passwordService.compare(
      password,
      user.password
    );
    return passwordCompareResult;
  }
}

export default fp<{ entityRef: UserPassAuthAbleEntity }>(
  function userPasswordAuthPlugin(fastify, config, done) {
    const hasPasswordService = fastify.hasDecorator("passwordService");
    const hasOrm = fastify.hasDecorator("orm");

    if (!hasPasswordService)
      throw new Error("Please init passwordServicePlugin");
    if (!hasOrm) throw new Error("Please init mikro-orm plugin");

    const service = new UserPasswordAuthService(
      fastify.orm.em,
      config.entityRef,
      fastify.passwordService
    );
    fastify.post<AuthRequestBody>(
      "/auth/login",
      schema,
      async function AdminLoginHandler(req) {
        const authResult = await service.login(req.body);

        return { result: authResult };
      }
    );

    done();
  },

  { name: "userPasswordAuthPlugin" }
);
