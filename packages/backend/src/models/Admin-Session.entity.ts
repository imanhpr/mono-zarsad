import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { randomUUID } from "node:crypto";
import Admin from "./Admin.entity.ts";

@Entity()
export default class AdminSession {
  @PrimaryKey({ type: "uuid" })
  id: string = randomUUID();

  @ManyToOne(() => Admin)
  user!: Admin;

  @Property()
  createdAt: Date = new Date();

  @Property()
  expireAt!: Date;
}
