import { describe, expect, test, vi } from "vitest";
import authServicePlugin, { AuthService } from "../auth.service.ts";
import User from "../../../models/User.entity.ts";
import Keyv from "keyv";
import { IOtpSender } from "../../../plugins/sms-provider/types.ts";
import fastify from "fastify";
import i18n from "../../../i18n/index.ts";
import { NotFoundError } from "@mikro-orm/core";
import i18next from "i18next";

describe("AuthService unit tests", () => {
  function testingModuleFactory({
    fakeKv,
    fakeOtpService,
    fakeReqCtx,
    fakeUserRepo,
    fakeUserSessionRepo,
    fakeUserFactoryService,
    fakeJwt,
  }: {
    fakeUserRepo?: any;
    fakeReqCtx?: any;
    fakeOtpService?: any;
    fakeKv?: any;
    fakeUserSessionRepo?: any;
    fakeUserFactoryService?: any;
    fakeJwt?: any;
  }) {
    return fastify()
      .decorate("userRepo", fakeUserRepo ?? {})
      .decorate("requestContext", fakeReqCtx ?? {})
      .decorate("sms", fakeOtpService ?? {})
      .decorate("cache", fakeKv ?? {})
      .decorate("userSessionRepo", fakeUserSessionRepo ?? {})
      .decorate("jwt", fakeJwt ?? {})
      .decorate("userFactoryService", fakeUserFactoryService ?? {})
      .register(i18n)
      .register(authServicePlugin);
  }

  const fakeReqCtx = {
    get: vi.fn(() => ({
      info: vi.fn(),
      warn: vi.fn(),
    })),
  };

  describe("login method", () => {
    test("Happy path", async () => {
      const fakeRandomOtpCode = 10000;
      const fakeValidPhoneNumber = "+989025121233";
      const user = new User();
      user.phoneNumber = fakeValidPhoneNumber;

      const fakeUserRepo = {
        findUserByPhoneNumber: vi.fn(() => user),
      };

      const fakeKv = new Keyv();

      const kvHasSpy = vi.spyOn(fakeKv, "has");
      kvHasSpy.mockResolvedValueOnce(false);

      const kvSetSpy = vi.spyOn(fakeKv, "set");
      kvSetSpy.mockResolvedValueOnce(true);

      const sendOTP = vi.fn();
      sendOTP.mockResolvedValueOnce(true);

      const fakeOtpService: IOtpSender = { sendOTP };

      vi.mock(import("../../../helpers/index.ts"), async (original) => {
        const mod = await original();
        const fakeRandomOtpCode = 10000;
        return {
          ...mod,
          randInt: vi.fn(async () => fakeRandomOtpCode),
        };
      });

      const testingModule = testingModuleFactory({
        fakeUserRepo,
        fakeReqCtx,
        fakeOtpService,
        fakeKv,
      });

      await testingModule.ready();
      const authService = testingModule.authService;

      const result = await authService.login(fakeValidPhoneNumber);

      expect(authService).toBeDefined();
      expect(result).toMatchSnapshot();

      expect(fakeUserRepo.findUserByPhoneNumber).toBeCalledWith(
        fakeValidPhoneNumber
      );
      expect(fakeOtpService.sendOTP).toBeCalledWith(
        fakeRandomOtpCode,
        fakeValidPhoneNumber
      );

      expect(kvHasSpy).toBeCalledWith(`OTP_REQ-${fakeValidPhoneNumber}`);
      expect(kvSetSpy).toHaveBeenCalledExactlyOnceWith(
        `OTP_REQ-${fakeValidPhoneNumber}`,
        fakeRandomOtpCode,
        120000
      );
    });
    test("it should throw BusinessOperationException since phoneNumber is invalid and user doesn't exist", async () => {
      const fakeInvalidPhoneNumber = "+989025123333";
      const fakeMethod = vi.fn();
      fakeMethod.mockRejectedValueOnce(new NotFoundError("Dummy Message"));
      const fakeUserRepo = { findUserByPhoneNumber: fakeMethod };

      const testingModule = testingModuleFactory({ fakeUserRepo, fakeReqCtx });
      await testingModule.ready();

      const authService: Pick<AuthService, "login"> = testingModule.authService;

      return expect(async () =>
        authService.login(fakeInvalidPhoneNumber)
      ).rejects.toThrowError(i18next.t("USER_NOT_FOUND_WITH_PHONE_NUMBER"));
    });

    test("it should return a BusinessOperationException since the code has sent before", async () => {
      const fakeValidPhoneNumber = "+989025123333";
      const user = new User();
      user.phoneNumber = fakeValidPhoneNumber;
      const fakeMethod = vi.fn();
      fakeMethod.mockResolvedValueOnce(user);
      const fakeKv = new Keyv();
      const kvHasSpy = vi.spyOn(fakeKv, "has");
      kvHasSpy.mockResolvedValueOnce(true);
      const fakeUserRepo = { findUserByPhoneNumber: fakeMethod };
      const testingModule = testingModuleFactory({
        fakeReqCtx,
        fakeUserRepo,
        fakeKv,
      });
      await testingModule.ready();

      const authService: Pick<AuthService, "login"> = testingModule.authService;

      return expect(async () =>
        authService.login(fakeValidPhoneNumber)
      ).rejects.toThrowError(i18next.t("OTP_RESEND_ERROR"));
    });

    test("it should return an Error since it has returned false when it was trying to set random number in cache", async () => {
      const fakeValidPhoneNumber = "+989025123333";
      const user = new User();
      user.phoneNumber = fakeValidPhoneNumber;
      const fakeMethod = vi.fn();
      fakeMethod.mockResolvedValue(user);
      const fakeUserRepo = { findUserByPhoneNumber: fakeMethod };

      const fakeKv = new Keyv();
      const kvHasSpy = vi.spyOn(fakeKv, "has");
      const kvSetSpy = vi.spyOn(fakeKv, "set");
      kvHasSpy.mockResolvedValueOnce(false);
      kvSetSpy.mockResolvedValueOnce(false);

      const testingModule = testingModuleFactory({
        fakeKv,
        fakeUserRepo,
        fakeReqCtx,
      });

      await testingModule.ready();

      const authService: Pick<AuthService, "login"> = testingModule.authService;

      return expect(() =>
        authService.login(fakeValidPhoneNumber)
      ).rejects.toThrowError(Error);
    });
  });
});
