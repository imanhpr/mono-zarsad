import { timingSafeEqual } from "node:crypto";

import fp from "fastify-plugin";
import { BusinessOperationResult, randInt } from "../../helpers/index.ts";

import type User from "../../models/User.entity.ts";
import { type UserRepo } from "../../repository/User.repo.ts";
import { type Cache } from "cache-manager";
import { type IOtpSender } from "../../plugins/sms-provider/types.ts";
import { type JWT } from "@fastify/jwt";
import type { SessionRepo } from "../../repository/Session.repo.ts";
import type UserSession from "../../models/User-Session.entity.ts";
import UserFactoryService from "../shared/UserFactory.service.ts";
import { BusinessOperationException } from "../../exceptions/index.ts";
import i18next from "i18next";

type CreateUser = Pick<
  User,
  "firstName" | "lastName" | "nationalCode" | "phoneNumber"
>;

export class AuthService {
  #userRepo: UserRepo;
  #sharedUserFactoryService: UserFactoryService;
  #otpService: IOtpSender;
  #cache: Cache;
  #sessionRepo: SessionRepo<typeof UserSession, typeof User>;
  #jwtSign: Pick<JWT, "sign">["sign"];
  constructor(
    userRepo: UserRepo,
    otpService: IOtpSender,
    cache: Cache,
    sessionRepo: SessionRepo<typeof UserSession, typeof User>,
    jwtSign: Pick<JWT, "sign">["sign"],
    sharedUserFactoryService: UserFactoryService
  ) {
    this.#userRepo = userRepo;
    this.#otpService = otpService;
    this.#cache = cache;
    this.#sessionRepo = sessionRepo;
    this.#jwtSign = jwtSign;
    this.#sharedUserFactoryService = sharedUserFactoryService;
  }

  async login(phoneNumber: string): Promise<
    BusinessOperationResult<{
      isOtpSend: boolean;
    }>
  > {
    let user: User | null;
    try {
      user = await this.#userRepo.findUserByPhoneNumber(phoneNumber);
    } catch (err) {
      throw new BusinessOperationException(
        400,
        i18next.t("USER_NOT_FOUND_WITH_PHONE_NUMBER"),
        {
          phoneNumber,
        }
      );
    }
    const result = await this.#sendOTP(user.phoneNumber);
    return new BusinessOperationResult(
      "success",
      i18next.t("OTP_SUCCESS_MESSAGE"),
      {
        isOtpSend: result,
      }
    );
  }

  async verify(phoneNumber: string, code: string) {
    const cacheCode = await this.#cache.get<number>(phoneNumber);
    if (
      cacheCode &&
      timingSafeEqual(Buffer.from(cacheCode.toString()), Buffer.from(code))
    ) {
      const user = await this.#userRepo.findUserByPhoneNumber(phoneNumber);
      const session = await this.#sessionRepo.createNew(user.id);
      const token = await this.#createJwtToken(session.user);
      return Object.freeze({ session, token });
    }
    throw new Error("Code Not Found");
  }
  async register(user: CreateUser) {
    const result = await this.#sendOTP(user.phoneNumber);
    await this.#sharedUserFactoryService.createNormalUser(user);
    return { success: result };
  }

  async refreshToken(sid: string) {
    const session = await this.#sessionRepo.findOne(sid);
    const now = new Date();
    // TODO: Check for expire date
    if (now >= session.expireAt) throw new Error("Invalid TOken");
    if (!session) throw new Error("Session Not found");

    const newSession = await this.#sessionRepo.createNew(session.user.id);
    const token = await this.#createJwtToken(newSession.user);

    return { session: newSession, token };
  }

  async logout(sid: string) {
    const session = await this.#sessionRepo.findOne(sid);
    const now = new Date();
    if (now >= session.expireAt) {
      throw new Error("Invalid Token");
    }
    return this.#sessionRepo.expireById(sid);
  }

  async #sendOTP(phoneNumber: string) {
    const code = await randInt(10000, 99999);
    try {
      await this.#cache.set(phoneNumber, code, 1000 * 60 * 2);
    } catch (err) {
      return false;
    }
    const result = await this.#otpService.sendOTP(code, phoneNumber);
    return result;
  }
  #createJwtToken(user: User): Promise<{ token: string; expireAt: number }> {
    const { promise, reject, resolve } = Promise.withResolvers<{
      token: string;
      expireAt: number;
    }>();
    const exp = Date.now() + 1000 * 60 * 30;
    const jwtPayload = {
      userId: user.id,
    };
    this.#jwtSign(jwtPayload, { expiresIn: "30m" }, (err, token) => {
      if (err) return reject(err);
      resolve({ token, expireAt: exp });
    });
    return promise;
  }
}

export default fp(
  function authServicePlugin(fastify, _, done) {
    const hasUserRepo = fastify.hasDecorator("userRepo");
    const hasSmsService = fastify.hasDecorator("sms");
    const hasCacheManager = fastify.hasDecorator("cache");
    const hasUserSessionRepo = fastify.hasDecorator("userSessionRepo");

    if (!hasUserRepo) throw new Error("Please init userRepo");
    if (!hasSmsService) throw new Error("Please init smsService");
    if (!hasCacheManager) throw new Error("Please init `cache` manager");
    if (!hasUserSessionRepo) throw new Error("Please init userSessionRepo");

    const authService = new AuthService(
      fastify.userRepo,
      fastify.sms,
      fastify.cache,
      fastify.userSessionRepo,
      fastify.jwt.sign,
      fastify.userFactoryService
    );
    fastify.decorate("authService", authService);
    done();
  },
  { name: "authServicePlugin" }
);

declare module "fastify" {
  interface FastifyInstance {
    authService: InstanceType<typeof AuthService>;
  }
}
