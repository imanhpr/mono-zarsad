import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export default class SystemInfo {
  @PrimaryKey({ type: "string" })
  id!: string;

  @Property({ type: "jsonb", nullable: true })
  value?: Record<string, unknown>;
}
