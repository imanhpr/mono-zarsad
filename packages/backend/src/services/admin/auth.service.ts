import { IsolationLevel, Transactional } from "@mikro-orm/core";
import i18next from "i18next";
import * as luxon from "luxon";

import { BusinessOperationException } from "../../exceptions/index.ts";

import { type PasswordService } from "../../plugins/password/index.ts";
import { type AdminSessionRepo } from "../../repository/Admin-Session.repo.ts";
import { type AdminRepo } from "../../repository/Admin.repo.ts";
import { type JWT } from "@fastify/jwt";
import { BusinessOperationResult } from "../../helpers/index.ts";
import AdminSession from "../../models/Admin-Session.entity.ts";

export class AdminAuthService {
  #passwordService: PasswordService;
  #adminRepo: AdminRepo;
  #adminSessionRepo: AdminSessionRepo;
  #jwt: JWT["sign"];
  constructor(
    passwordService: PasswordService,
    adminRepo: AdminRepo,
    adminSessionRepo: AdminSessionRepo,
    jwt: JWT["sign"]
  ) {
    this.#passwordService = passwordService;
    this.#adminRepo = adminRepo;
    this.#adminSessionRepo = adminSessionRepo;
    this.#jwt = jwt;
  }

  @Transactional()
  async login(
    username: string,
    inputPassword: string
  ): Promise<
    readonly [
      AdminSession,
      BusinessOperationResult<{
        accessToken: string;
        expireAt: string;
      }>,
    ]
  > {
    let admin: null | Awaited<ReturnType<AdminRepo["findOneByUserName"]>>;
    try {
      admin = await this.#adminRepo.findOneByUserName(username);
    } catch (err) {
      throw new BusinessOperationException(
        401,
        i18next.t("ADMIN_USERNAME_PASSWORD_INVALID")
      );
    }

    const passwordCompareResult = await this.#passwordService.compare(
      inputPassword,
      admin.password
    );

    if (!passwordCompareResult)
      throw new BusinessOperationException(
        401,
        i18next.t("ADMIN_USERNAME_PASSWORD_INVALID")
      );
    const now = luxon.DateTime.now().toUTC();
    const expireAt = now.plus({ hour: 12 });
    const refreshToken = await this.#adminSessionRepo.create(
      admin,
      now.toJSDate(),
      expireAt.toJSDate()
    );

    const accessToken = await this.#createJwtToken(refreshToken);
    const jwtExpireAt = now.plus({ minutes: 30 });
    const result = [
      refreshToken,
      new BusinessOperationResult("success", "Auth ok", {
        accessToken,
        expireAt: jwtExpireAt.toUTC().toISO(),
      }),
    ] as const;
    return result;
  }

  logout() {}

  @Transactional()
  async refresh(sid: string): Promise<
    readonly [
      AdminSession,
      BusinessOperationResult<{
        accessToken: string;
        expireAt: string;
      }>,
    ]
  > {
    const session = await this.#adminSessionRepo.findOneById(sid);
    const now = luxon.DateTime.now().toUTC();
    const expireAt = luxon.DateTime.fromJSDate(session.expireAt).toUTC();

    if (now > expireAt)
      throw new BusinessOperationException(
        401,
        i18next.t("EXPIRED_REFRESH_TOKEN")
      );

    this.#adminSessionRepo.expireRefreshToken(session);

    const newExpireAt = now.plus({ hour: 12 }).toUTC();
    const newSession = this.#adminSessionRepo.create(
      session.user,
      now.toJSDate(),
      newExpireAt.toJSDate()
    );

    const accessToken = await this.#createJwtToken(newSession);
    const jwtExpireAt = now.plus({ minutes: 30 }).toUTC();

    const result = [
      newSession,
      new BusinessOperationResult("success", "Auth ok", {
        accessToken,
        expireAt: jwtExpireAt.toUTC().toISO(),
      }),
    ] as const;
    return result;
  }

  async #createJwtToken(session: AdminSession) {
    const accessToken = await this.#jwt(
      { adminId: session.user.id, type: "admin" },
      { expiresIn: "30m" }
    );
    return accessToken;
  }
}
