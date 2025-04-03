import { Entity, ManyToOne } from "@mikro-orm/core";
import WalletTransaction from "./Wallet-Transaction.entity.ts";

@Entity()
export default class WalletToWalletTransaction {
  @ManyToOne(() => WalletTransaction, { primary: true })
  id!: string;
}
