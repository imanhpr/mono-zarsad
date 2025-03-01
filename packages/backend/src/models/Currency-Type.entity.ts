import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import CurrencyPrice from "./Currency-Price.entity.ts";
import Wallet from "./Wallet.entity.ts";
import WalletTransaction from "./Wallet-Transaction.entity.ts";

@Entity()
export default class CurrencyType {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  name_farsi!: string;

  @OneToMany(() => CurrencyPrice, (price) => price.currency)
  prices = new Collection<CurrencyPrice>(this);

  @OneToMany(() => Wallet, (w) => w.currencyType)
  wallets = new Collection<Wallet>(this);

  @OneToMany(() => WalletTransaction, (wt) => wt.currencyType)
  walletTransactions = new Collection<WalletTransaction>(this);
}
