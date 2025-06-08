import fp from "fastify-plugin";
import { EntityManager, LockMode, sql } from "@mikro-orm/postgresql";
import { monotonicFactory } from "ulid";
import WalletTransaction from "../models/Wallet-Transaction.entity.ts";

const ulid = monotonicFactory();

export class WalletTransactionRepo {
  #em: EntityManager;
  constructor(em: EntityManager) {
    this.#em = em;
  }

  create(
    transactionType: "EXCHANGE" | "WALLET_TO_WALLET" | "SIMPLE",
    createdAt: Date,
    isLockable: boolean,
    isLock: boolean
  ) {
    return this.#em.create(WalletTransaction, {
      id: ulid(),
      type: transactionType,
      isLock,
      isLockable,
      createdAt,
    });
  }

  findOneByTransactionId(transactionId: string) {
    return this.#em.findOneOrFail(WalletTransaction, {
      id: transactionId,
    });
  }

  async countAllTransactions() {
    type TransactionType = WalletTransaction["type"] | "ALL";
    type CountInfo = { type: TransactionType; count: string };

    const transactionsPromise = this.#em
      .createQueryBuilder(WalletTransaction, "w")
      .select(["type", sql`count(w.type)`])
      .groupBy("type")
      .execute<CountInfo[]>();

    const allTransactionsPromise = this.#em.count(WalletTransaction);
    const [transactions, allTransactions] = await Promise.all([
      transactionsPromise,
      allTransactionsPromise,
    ] as const);

    const ALL: CountInfo = { type: "ALL", count: allTransactions.toString() };
    transactions.push(ALL);
    return transactions;
  }

  async selectTransactionByIdWithLockForUpdate(transactionId: string) {
    return this.#em.findOneOrFail(
      WalletTransaction,
      {
        id: transactionId,
      },
      { lockMode: LockMode.PESSIMISTIC_WRITE }
    );
  }

  async transactionHistory(
    orderBy: "DESC" | "ASC",
    offset: number,
    limit: number
  ) {
    const [transactions, count] = await this.#em.findAndCount(
      WalletTransaction,
      {},
      {
        orderBy: { createdAt: orderBy },
        offset,
        limit,
      }
    );

    return Object.freeze({ count, transactions });
  }
}

export default fp(
  function walletTransactionRepoPlugin(fastify, _, done) {
    const walletTransactionRepo = new WalletTransactionRepo(
      fastify.orm.em as EntityManager
    );
    fastify.decorate("walletTransactionRepo", walletTransactionRepo);
    done();
  },
  {
    name: "walletTransactionRepoPlugin",
    decorators: {
      fastify: ["orm"],
    },
  }
);

declare module "fastify" {
  export interface FastifyInstance {
    walletTransactionRepo: InstanceType<typeof WalletTransactionRepo>;
  }
}
