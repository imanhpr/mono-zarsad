import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { UserFactory } from "./UserSeederFactory.ts";
export class DummyUserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users = new UserFactory(em).make(100);
    em.persist(users);
  }
}
