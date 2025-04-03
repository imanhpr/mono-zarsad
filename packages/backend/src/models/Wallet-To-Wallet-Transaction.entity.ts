import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import WalletTransaction from "./Wallet-Transaction.entity.ts";

@Entity()
export default class WalletToWalletTransaction {
  @ManyToOne(() => WalletTransaction, { primary: true })
  id!: string;

  @Property()
  createdAt = new Date();
}
