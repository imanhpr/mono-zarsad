import { Entity, PrimaryKey } from "@mikro-orm/core";

@Entity()
export default class Setting {
  @PrimaryKey()
  id!: number;
}
