import test, { before, describe, mock } from "node:test";
import { AuthService } from "../auth.service.ts";
import { createCache } from "cache-manager";
import User from "../../../models/User.entity.ts";
import assert from "node:assert";
import { NotFoundError } from "@mikro-orm/core";
import { UserRepo } from "../../../repository/User.repo.ts";

describe("auth.service unit tests", () => {
  test("login method", async (t) => {
    t.plan(3);
    await t.test("Happy path for login method", async (t) => {
      t.plan(10);
      const phoneNumber = "+989025121222";
      const fakeUser = new User();
      fakeUser.phoneNumber = phoneNumber;

      const userRepo = {
        findUserByPhoneNumber: mock.fn(async () => fakeUser),
      };
      const otpService = { sendOTP: mock.fn(async () => true) };

      const cacheManager = { set: mock.fn(async () => 1) };
      const authService: Pick<AuthService, "login"> = new AuthService(
        userRepo as any,
        otpService as any,
        cacheManager as any,
        {} as any,
        {} as any,
        {} as any
      );
      const result = await authService.login(phoneNumber);

      const findUserCallCount = userRepo.findUserByPhoneNumber.mock.callCount();
      const findUserCallArgs =
        userRepo.findUserByPhoneNumber.mock.calls[0].arguments.at(0);
      // @ts-ignore
      t.assert.deepStrictEqual(result, {
        status: "success",
        message: "completed",
        success: true,
      });

      const sendOtpCallCount = otpService.sendOTP.mock.callCount();
      const sendOtpCallArgs = otpService.sendOTP.mock.calls[0].arguments;

      const cacheSetCallCount = cacheManager.set.mock.callCount();
      const cacheSetArgs = cacheManager.set.mock.calls[0].arguments;

      t.assert.equal(findUserCallCount, 1);
      t.assert.equal(sendOtpCallCount, 1);
      t.assert.equal(cacheSetCallCount, 1);
      // first argument phoneNumber : string
      t.assert.equal(findUserCallArgs, phoneNumber);

      // first argument code : number
      // @ts-ignore
      t.assert.ok(
        typeof sendOtpCallArgs.at(0) === "number",
        "it must be a random number like 34502"
      );
      // second argument phoneNumber : string
      t.assert.equal(sendOtpCallArgs.at(1), phoneNumber);

      // first argument phoneNumber : string
      t.assert.equal(cacheSetArgs.at(0), phoneNumber);
      // second argument code : random number
      // @ts-ignore
      t.assert.ok(typeof cacheSetArgs.at(1) === "number");
      // third argument time :
      // @ts-ignore
      t.assert.ok(typeof cacheSetArgs.at(2) === "number");
    });

    await t.test(
      "it should return false when #userRepo.findUserByPhoneNumber fails",
      async (t) => {
        t.plan(1);
        const fakeInvalidPhoneNumber = "+989025121223";
        const userRepo = {
          findUserByPhoneNumber: mock.fn(async () => {
            throw new NotFoundError(
              `User not found ({ phoneNumber: '${fakeInvalidPhoneNumber}' })`
            );
          }),
        };

        const authService: Pick<AuthService, "login"> = new AuthService(
          userRepo as any,
          {} as any,
          {} as any,
          {} as any,
          {} as any,
          {} as any
        );
        const result = await authService.login(fakeInvalidPhoneNumber);

        const _ = t.assert.deepStrictEqual(result, {
          status: "failed",
          message: "user not found",
          success: false,
        });
      }
    );

    await t.test(
      "it should return false when #cache.set throws an error",
      async (t) => {
        t.plan(1);
        const fakeValidPhoneNumber = "+989025121233";
        const userRepo = {
          findUserByPhoneNumber: mock.fn(async () => new User()),
        };

        const cacheManager = {
          set: mock.fn(async () => {
            // At runtime it has different type.
            throw new Error("Dummy error");
          }),
        };

        const authService: Pick<AuthService, "login"> = new AuthService(
          userRepo as any,
          {} as any,
          cacheManager as any,
          {} as any,
          {} as any,
          {} as any
        );

        const result = await authService.login(fakeValidPhoneNumber);
        // @ts-ignore
        t.assert.deepStrictEqual(result, {
          status: "success",
          message: "completed",
          success: false,
        });
      }
    );
  });
});
