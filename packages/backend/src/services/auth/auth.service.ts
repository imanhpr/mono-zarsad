import { timingSafeEqual } from "node:crypto";

import fp from "fastify-plugin";
import { BusinessOperationResult, randInt } from "../../helpers/index.ts";

import type User from "../../models/User.entity.ts";
import { type UserRepo } from "../../repository/User.repo.ts";
import { type IOtpSender } from "../../plugins/sms-provider/types.ts";
import { type JWT } from "@fastify/jwt";
import type UserSession from "../../models/User-Session.entity.ts";
import UserFactoryService from "../shared/UserFactory.service.ts";
import { BusinessOperationException } from "../../exceptions/index.ts";
import i18next from "i18next";
import Keyv from "keyv";
import { FastifyRedis } from "@fastify/redis";
import { RequestContext } from "@fastify/request-context";
import {
  Loaded,
  NotFoundError,
  Transactional,
  UniqueConstraintViolationException,
} from "@mikro-orm/core";
import * as luxon from "luxon";
import { type UserSessionRepo } from "../../repository/User-Session.repo.ts";
import { type RefreshTokenRepo } from "../../repository/Refresh-Token.repo.ts";
import type RefreshToken from "../../models/Refresh-Token.entity.ts";

type CreateUser = Pick<
  User,
  "firstName" | "lastName" | "nationalCode" | "phoneNumber"
>;
export class AuthService {
  #OTP_TTL = luxon.Duration.fromObject({ minutes: 2 })
    .shiftTo("milliseconds")
    .toMillis();
  #userRepo: UserRepo;
  #sharedUserFactoryService: UserFactoryService;
  #otpService: IOtpSender;
  #cache: Keyv<FastifyRedis>;
  #sessionRepo: UserSessionRepo;
  #jwtSign: Pick<JWT, "sign">["sign"];
  #ctx: RequestContext;
  #refreshTokenRepo: RefreshTokenRepo;

  constructor(
    userRepo: UserRepo,
    otpService: IOtpSender,
    cache: Keyv,
    sessionRepo: UserSessionRepo,
    jwtSign: Pick<JWT, "sign">["sign"],
    sharedUserFactoryService: UserFactoryService,
    ctx: RequestContext,
    refreshTokenRepo: RefreshTokenRepo
  ) {
    this.#userRepo = userRepo;
    this.#otpService = otpService;
    this.#cache = cache;
    this.#sessionRepo = sessionRepo;
    this.#jwtSign = jwtSign;
    this.#sharedUserFactoryService = sharedUserFactoryService;
    this.#ctx = ctx;
    this.#refreshTokenRepo = refreshTokenRepo;
  }

  async login(phoneNumber: string): Promise<
    BusinessOperationResult<{
      isOtpSend: boolean;
    }>
  > {
    const logger = this.#ctx.get("reqLogger")!;
    logger.info({ phoneNumber }, "User not found. Try to send login otp");

    let user: User | null;
    try {
      user = await this.#userRepo.findUserByPhoneNumber(phoneNumber);
      logger.info({ phoneNumber, userId: user.id }, "User has just found");
    } catch (err) {
      if (err instanceof NotFoundError) {
        logger.warn(err, "Try to return BusinessOperationException exception");
        throw new BusinessOperationException(
          400,
          i18next.t("USER_NOT_FOUND_WITH_PHONE_NUMBER"),
          {
            phoneNumber,
          }
        );
      }
      throw err;
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
  @Transactional()
  async verify(phoneNumber: string, code: string, userAgent: string) {
    const logger = this.#ctx.get("reqLogger")!;
    const key = AuthService.#otpKeyFactory(phoneNumber);
    const now = luxon.DateTime.now();
    const sessionDuration = luxon.Duration.fromObject({ days: 14 });
    const sessionExpireDate = now.plus(sessionDuration);
    logger.debug({ phoneNumber }, "Try to find otp code");
    const cacheCode = await this.#cache.get<number>(key);
    if (
      cacheCode &&
      timingSafeEqual(Buffer.from(cacheCode.toString()), Buffer.from(code))
    ) {
      logger.debug(
        { key },
        "otp code has just found. try to delete it from cache"
      );
      await this.#cache.delete(key);

      logger.debug({ phoneNumber }, "try to find user by phone number");
      const user = await this.#userRepo.findUserByPhoneNumber(phoneNumber);
      logger.debug("try to create active session for user");
      const session = await this.#sessionRepo.create(user, userAgent, true);
      logger.debug("try to create refresh token for user");
      const refreshToken = this.#refreshTokenRepo.create(
        session,
        now.toJSDate(),
        sessionExpireDate.toJSDate()
      );
      logger.debug("try to create access token for user");
      const accessToken = await this.#createJwtToken(session.user, session);
      logger.info(
        "Every thing sound good. return refresh token and access token to user"
      );
      return Object.freeze({ refreshToken, accessToken });
    }
    logger.info(
      { userInputOtpCode: code },
      "otp code not found for user. return 400 error to user"
    );
    throw new BusinessOperationException(
      400,
      i18next.t("OTP_CODE_IS_INVALID"),
      { phoneNumber, code }
    );
  }
  async register(user: CreateUser) {
    const logger = this.#ctx.get("reqLogger")!;
    logger.debug(
      { phoneNumber: user.phoneNumber },
      "try to send otp code to user"
    );
    const isOtpSent = await this.#sendOTP(user.phoneNumber);
    logger.debug({ isOtpSent }, "otp send result");
    if (isOtpSent) {
      logger.debug("Try to create new normal user");
      try {
        await this.#sharedUserFactoryService.createNormalUser(user);
      } catch (err) {
        if (err instanceof UniqueConstraintViolationException) {
          logger.error("User with this stuff already exists in db, return 409");
          throw new BusinessOperationException(
            409,
            i18next.t("USER_EXISTS_BEFORE"),
            user
          );
        }
        logger.error(
          err,
          "unhandled error, please check this error and add correct handler for it"
        );
        throw err;
      }
      logger.info(
        "User has just created successfully, return success response"
      );
      return new BusinessOperationResult(
        "success",
        i18next.t("NEW_USER_CREATE_MESSAGE"),
        { isOtpSent }
      );
    }
    logger.warn("something bad has happened and i don't know why");
    throw new Error("Internal Server Error");
  }

  @Transactional()
  async refreshToken(refreshToken: string) {
    const now = luxon.DateTime.now();
    const sessionDuration = luxon.Duration.fromObject({ days: 14 });
    const sessionExpireDate = now.plus(sessionDuration);
    const refToken =
      await this.#refreshTokenRepo.findRefreshTokenByIdAndActiveSession(
        refreshToken
      );

    this.#isRefreshTokenExpired(refToken.expireAt);
    try {
      await this.#refreshTokenRepo.expireRefreshToken(refToken);
    } catch (err) {
      throw new Error("Internal Server Error");
    }

    const newRefToken = await this.#refreshTokenRepo.create(
      refToken.session,
      now.toJSDate(),
      sessionExpireDate.toJSDate()
    );
    const accessToken = await this.#createJwtToken(
      refToken.session.user,
      refToken.session
    );

    return { refreshToken: newRefToken, accessToken };
  }

  async logout(refreshToken: string) {
    let currentRefreshToken: Loaded<
      RefreshToken,
      "session",
      "*",
      never
    > | null = null;

    try {
      currentRefreshToken =
        await this.#refreshTokenRepo.findRefreshTokenByIdAndActiveSession(
          refreshToken
        );
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new BusinessOperationException(
          400,
          i18next.t("INVALID_REFRESH_TOKEN")
        );
      }
      throw err;
    }
    await this.#sessionRepo.deactivateSession(currentRefreshToken.session);
  }

  #isRefreshTokenExpired(refreshTokenExpireDate: Date) {
    const now = luxon.DateTime.now();
    if (now >= luxon.DateTime.fromJSDate(refreshTokenExpireDate)) {
      throw new BusinessOperationException(
        401,
        i18next.t("EXPIRED_REFRESH_TOKEN")
      );
    }
  }

  async #sendOTP(phoneNumber: string) {
    const key = AuthService.#otpKeyFactory(phoneNumber);
    const code = await randInt(10000, 99999);
    const isSentBefore = await this.#cache.has(key);
    if (isSentBefore) {
      throw new BusinessOperationException(400, i18next.t("OTP_RESEND_ERROR"), {
        phoneNumber,
      });
    }
    const cacheSetResult = await this.#cache.set(key, code, this.#OTP_TTL);
    if (!cacheSetResult) {
      throw new Error("Internal Server Error");
    }
    const result = await this.#otpService.sendOTP(code, phoneNumber);
    return result;
  }
  #createJwtToken(
    user: User,
    session: UserSession
  ): Promise<{ token: string; expireAt: string }> {
    const { promise, reject, resolve } = Promise.withResolvers<{
      token: string;
      expireAt: string;
    }>();
    const now = luxon.DateTime.now();
    const exp = luxon.Duration.fromObject({ minutes: 59 });
    const expireAt = now.plus(exp);
    const jwtPayload = {
      userId: user.id,
      sessionId: session.id,
    };
    this.#jwtSign(jwtPayload, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve({ token, expireAt: expireAt.toUTC().toISO() });
    });
    return promise;
  }

  static #otpKeyFactory(phoneNumber: string) {
    return `OTP_REQ:${phoneNumber}`;
  }
}

export default fp(
  function authServicePlugin(fastify, _, done) {
    const authService = new AuthService(
      fastify.userRepo,
      fastify.sms,
      fastify.cache,
      fastify.userSessionRepo,
      fastify.jwt.sign,
      fastify.userFactoryService,
      fastify.requestContext,
      fastify.refreshTokenRepo
    );
    fastify.decorate("authService", authService);
    done();
  },
  {
    name: "authServicePlugin",
    decorators: {
      fastify: [
        "userRepo",
        "sms",
        "cache",
        "userSessionRepo",
        "jwt",
        "userFactoryService",
        "requestContext",
        "refreshTokenRepo",
      ],
    },
  }
);

declare module "fastify" {
  interface FastifyInstance {
    authService: InstanceType<typeof AuthService>;
  }
}
