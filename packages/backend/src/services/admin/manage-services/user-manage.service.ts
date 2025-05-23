import fp from "fastify-plugin";
import { type UserRepo } from "../../../repository/User.repo.ts";
import { type ICreateNewUser } from "../../../types/user.ts";
import {
  BusinessOperationResult,
  mapDateToJalali,
} from "../../../helpers/index.ts";
import UserFactoryService from "../../shared/UserFactory.service.ts";
import { BusinessOperationException } from "../../../exceptions/index.ts";
import { UniqueConstraintViolationException } from "@mikro-orm/core";
import i18next from "i18next";
import {
  IGetUserQueryParamSchema,
  IUserListQueryFilterSchema,
} from "../routes/user/schema.ts";

class UserManageService {
  #repo: UserRepo;
  #sharedUserFactoryService: UserFactoryService;
  constructor(repo: UserRepo, userFactoryService: UserFactoryService) {
    this.#repo = repo;
    this.#sharedUserFactoryService = userFactoryService;
  }

  async createUser(input: ICreateNewUser) {
    input.firstName = input.firstName.trim();
    input.lastName = input.lastName.trim();
    input.nationalCode = input.nationalCode.trim();
    input.phoneNumber = input.phoneNumber.trim();
    try {
      const result =
        await this.#sharedUserFactoryService.createNormalUser(input);

      return new BusinessOperationResult(
        "success",
        i18next.t("USER_HAS_JUST_CREATED_SUCCESSFULLY"),
        Object.freeze({
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          nationalCode: result.nationalCode,
          phoneNumber: result.phoneNumber,
        })
      );
    } catch (err) {
      if (err instanceof UniqueConstraintViolationException) {
        throw new BusinessOperationException(
          409,
          i18next.t("USER_EXISTS_IN_DB"),
          input
        );
      }
      // TODO: LOG HERE
      throw err;
    }
  }

  async getUserListByFilter(query: IUserListQueryFilterSchema) {
    const result = await this.#repo.findUserByFilter(query);
    return new BusinessOperationResult(
      "success",
      i18next.t("GET_RESULT_SUCCESS"),
      result
    );
  }

  deleteUserById(id: number) {
    return this.#repo.deleteUserById(id);
  }

  editUserById(userId: number, payload: { user: object; profile: object }) {
    return this.#repo.updateUserAndProfileById(userId, payload);
  }

  async userListByFilter(input: IGetUserQueryParamSchema) {
    const result = await this.#repo.findUsersByFilter(input);
    return new BusinessOperationResult(
      "success",
      i18next.t("GET_RESULT_SUCCESS"),
      {
        count: result.count,
        users: result.users,
      }
    );
  }
}

export default fp(
  function userManageService(fastify, _, done) {
    const userManageService = new UserManageService(
      fastify.userRepo,
      fastify.userFactoryService
    );
    fastify.decorate("userManageService", userManageService);
    done();
  },
  {
    name: "userManageService",
    decorators: {
      fastify: ["userRepo", "userFactoryService"],
    },
  }
);

declare module "fastify" {
  interface FastifyInstance {
    userManageService: InstanceType<typeof UserManageService>;
  }
}
