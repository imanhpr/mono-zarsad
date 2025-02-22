import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import AdminSession from "./Admin-Session.entity.ts";

@Entity()
export default class Admin {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  username!: string;

  @Property()
  password!: string;

  @OneToMany(() => AdminSession, (session) => session.user)
  sessions = new Collection<AdminSession>(this);
}
