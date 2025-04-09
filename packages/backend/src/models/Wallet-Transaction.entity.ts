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
  type!: "EXCHANGE" | "WALLET_TO_WALLET" | "SIMPLE";

  @OneToMany("WalletAudit", (e: WalletAudit) => e.walletTransaction)
  walletAudits = new Collection<WalletAudit>(this);

  @Property()
  isLockable!: boolean;

  @Property()
  isLock!: boolean;

  @Property()
  createdAt = new Date();
}
