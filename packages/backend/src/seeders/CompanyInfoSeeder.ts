import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import SystemInfo from "../models/System-Info.entity.ts";

export class CompanyInfoSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const key = "COMPANY_INFO";
    em.create(SystemInfo, {
      id: key,
      value: {
        name: "زرین بایت",
        economicNumber: "14009400300",
        nationalCode: "14009200100/192100",
        phoneNumber: "07734225240",
        postalCode: "8200100100",
        province: "بوشهر",
        city: "برازجان",
        address: "خیابان بیمارستان",
      },
    });
  }
}
