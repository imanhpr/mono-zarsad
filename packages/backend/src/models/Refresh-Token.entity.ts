import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { randomUUID } from "crypto";
import UserSession from "./User-Session.entity.ts";

@Entity()
export default class RefreshToken {
  @PrimaryKey({ type: "uuid" })
  id: string = randomUUID();

  @ManyToOne(() => UserSession)
  session!: UserSession;

  @Property()
  createdAt: Date = new Date();

  @Property()
  expireAt!: Date;
}
