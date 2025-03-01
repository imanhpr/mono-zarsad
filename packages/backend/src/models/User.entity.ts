import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import Session from "./User-Session.entity.ts";
import Profile from "./Profile.entity.ts";

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

  @OneToMany(() => Session, (session) => session.user)
  sessions = new Collection<Session>(this);

  @OneToOne(() => Profile, (prof) => prof.id)
  profile!: Profile;
}
