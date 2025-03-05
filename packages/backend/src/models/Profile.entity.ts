import { Entity, OneToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core";
import User from "./User.entity.ts";

@Entity()
export default class Profile {
  @PrimaryKey()
  id!: number;

  @Property()
  debtPrem: boolean = false;

  @OneToOne(() => User, (u) => u.profile, {
    orphanRemoval: true,
    deleteRule: "cascade",
  })
  user!: User;
}
