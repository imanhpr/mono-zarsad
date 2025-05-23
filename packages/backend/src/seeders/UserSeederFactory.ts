import { Factory } from "@mikro-orm/seeder";
import User from "../models/User.entity.ts";
import { EntityData } from "@mikro-orm/core";
import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";
import Profile from "../models/Profile.entity.ts";
import Wallet from "../models/Wallet.entity.ts";

export class UserFactory extends Factory<User> {
  model = User;
  protected definition(): EntityData<User> {
    const profile = new Profile();
    profile.debtPrem = faker.datatype.boolean();

    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      nationalCode: randomUUID(),
      phoneNumber: faker.phone.number({ style: "international" }),
      profile,
    };
    return user;
  }
}
