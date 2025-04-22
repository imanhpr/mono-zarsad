import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { randomUUID } from "node:crypto";
import User from "./User.entity.ts";
import RefreshToken from "./Refresh-Token.entity.ts";

@Entity()
export default class UserSession {
  @PrimaryKey({ type: "uuid" })
  id: string = randomUUID();

  @ManyToOne(() => User, { deleteRule: "cascade" })
  user!: User;

  @Property()
  createdAt: Date = new Date();

  @Property()
  lastOnline!: Date;

  @Property()
  updatedAt!: Date;

  @Property()
  device!: string;

  @Property()
  isActive!: boolean;

  @OneToMany(() => RefreshToken, (r) => r.session)
  refreshTokens = new Collection<RefreshToken>(this);
}
