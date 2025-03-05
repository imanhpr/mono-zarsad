import User from "../models/User.entity.ts";

export type ICreateNewUser = Pick<
  User,
  "firstName" | "lastName" | "nationalCode" | "phoneNumber"
>;
