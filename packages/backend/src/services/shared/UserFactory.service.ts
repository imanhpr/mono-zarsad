import { Transactional } from "@mikro-orm/core";
import { type CurrencyTypeRepo } from "../../repository/Currency-Type.repo.ts";
import { type UserRepo } from "../../repository/User.repo.ts";
import { type WalletRepo } from "../../repository/Wallet.repo.ts";
import { ICreateNewUser } from "../../types/user.ts";

export default class UserFactoryService {
  #userRepo: UserRepo;
  #walletRepo: WalletRepo;
  #currencyTypeRepo: CurrencyTypeRepo;
  constructor(
    userRepo: UserRepo,
    walletRepo: WalletRepo,
    currencyTypeRepo: CurrencyTypeRepo
  ) {
    this.#userRepo = userRepo;
    this.#walletRepo = walletRepo;
    this.#currencyTypeRepo = currencyTypeRepo;
  }

  @Transactional()
  async createNormalUser(input: ICreateNewUser) {
    const currencyTypes = await this.#currencyTypeRepo.findAll();

    const user = this.#userRepo.createNormal(input);
    currencyTypes.map((currencyType) =>
      this.#walletRepo.createNew(currencyType, user)
    );

    return user;
  }
}
