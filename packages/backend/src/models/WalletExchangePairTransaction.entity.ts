import {
  DecimalType,
  Entity,
  Enum,
  ManyToOne,
  Property,
} from "@mikro-orm/core";
import CurrencyPrice from "./Currency-Price.entity.ts";
import CurrencyType from "./Currency-Type.entity.ts";
import Wallet from "./Wallet.entity.ts";
import type WalletAudit from "./Wallet-Audit.entity.ts";
import WalletTransaction from "./Wallet-Transaction.entity.ts";

export enum WalletExchangeTransactionStatus {
  INIT = "INIT",
  SUCCESSFUL = "SUCCESSFUL",
  CANCEL_BY_USER = "CANCEL_BY_USER",
  CANCEL_BY_ADMIN = "CANCEL_BY_ADMIN",
}
@Entity()
export default class WalletExchangePairTransaction {
  @ManyToOne(() => WalletTransaction, { primary: true, type: "string" })
  id!: string;

  @ManyToOne("WalletAudit", { nullable: true })
  increment?: WalletAudit;

  @ManyToOne("WalletAudit", { nullable: true })
  decrement?: WalletAudit;

  @ManyToOne(() => CurrencyType)
  fromCurrency!: CurrencyType;

  @ManyToOne(() => CurrencyType)
  toCurrency!: CurrencyType;

  @ManyToOne(() => Wallet)
  fromWallet!: Wallet;

  @ManyToOne(() => Wallet)
  toWallet!: Wallet;

  @ManyToOne(() => CurrencyPrice)
  currencyPrice!: CurrencyPrice;

  @Property({ type: DecimalType, scale: 3, precision: 21 })
  fromValue!: string;

  @Property({ type: DecimalType, scale: 3, precision: 21 })
  toValue!: string;

  @Enum({
    items: () => WalletExchangeTransactionStatus,
    default: WalletExchangeTransactionStatus.INIT,
  })
  status: WalletExchangeTransactionStatus =
    WalletExchangeTransactionStatus.INIT;

  @Property()
  createdAt = new Date();

  @Property({ nullable: true, default: null })
  finalizeAt?: Date;

  isFinal(): boolean {
    const finalStates: WalletExchangeTransactionStatus[] = [
      WalletExchangeTransactionStatus.CANCEL_BY_ADMIN,
      WalletExchangeTransactionStatus.CANCEL_BY_USER,
      WalletExchangeTransactionStatus.SUCCESSFUL,
    ];
    return finalStates.includes(this.status);
  }
}
