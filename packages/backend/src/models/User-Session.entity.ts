import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { randomUUID } from "node:crypto";
import User from "./User.entity.ts";

@Entity()
export default class UserSession {
  @PrimaryKey({ type: "uuid" })
  id: string = randomUUID();

  @ManyToOne(() => User)
  user!: User;

  @Property()
  createdAt: Date = new Date();

  @Property()
  expireAt!: Date;
}
