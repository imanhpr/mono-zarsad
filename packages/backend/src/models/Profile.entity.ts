import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export default class Profile {
  @PrimaryKey()
  id!: number;

  @Property()
  debtPrem: boolean = false;
}
