import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export default class Admin {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  username!: string;

  @Property()
  password!: string;
}
