import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import type UserSession from "./User-Session.entity.ts";
import type Profile from "./Profile.entity.ts";

@Entity()
export default class User {
  @PrimaryKey()
  id!: number;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  phoneNumber!: string;

  @Property()
  nationalCode!: string;

  @OneToMany("UserSession", (session: UserSession) => session.user)
  sessions = new Collection<UserSession>(this);

  @OneToOne("Profile", (prof: Profile) => prof.user, { owner: true })
  profile!: Profile;
}
