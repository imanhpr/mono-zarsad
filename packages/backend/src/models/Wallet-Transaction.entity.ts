import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import WalletAudit from "./Wallet-Audit.entity.ts";

@Entity()
export default class WalletTransaction {
  @PrimaryKey({ type: "string" })
  id!: string;

  @Property()
  type!: string;

  @OneToMany("WalletAudit", (e: WalletAudit) => e.walletTransaction)
  walletAudits = new Collection<WalletAudit>(this);
}
