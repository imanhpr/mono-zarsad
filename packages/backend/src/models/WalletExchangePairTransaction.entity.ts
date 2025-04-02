import {
  Collection,
  DecimalType,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import type WalletTransaction from "./Wallet-Transaction.entity.ts";
import CurrencyPrice from "./Currency-Price.entity.ts";
import CurrencyType from "./Currency-Type.entity.ts";
import Wallet from "./Wallet.entity.ts";

export enum WalletExchangeTransactionStatus {
  INIT = "INIT",
  SUCCESSFUL = "SUCCESSFUL",
  CANCEL_BY_USER = "CANCEL_BY_USER",
  CANCEL_BY_ADMIN = "CANCEL_BY_ADMIN",
}
@Entity()
export default class WalletExchangePairTransaction {
  @PrimaryKey({ type: "string" })
  id!: string;

  @ManyToOne("WalletTransaction", { nullable: true })
  increment?: WalletTransaction;

  @ManyToOne("WalletTransaction", { nullable: true })
  decrement?: WalletTransaction;

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

  @OneToMany(
    "WalletTransaction",
    (e: WalletTransaction) => e.walletExchangePair
  )
  transactions = new Collection<WalletTransaction>(this);

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
