import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import Spread from "../models/Spread.entity.ts";

export class SpreadSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {}
}
