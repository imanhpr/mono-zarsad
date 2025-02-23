import { EntityClass, EntityManager, EntityName } from "@mikro-orm/core";
import * as luxon from "luxon";
import type AdminSession from "../models/Admin-Session.entity.ts";
import Admin from "../models/Admin.entity.js";
import type User from "../models/User.entity.js";
import type UserSession from "../models/User-Session.entity.ts";

export class SessionRepo<
  T extends typeof AdminSession | typeof UserSession = typeof AdminSession,
  E extends typeof Admin | typeof User = typeof Admin,
> {
  #em: EntityManager;
  #entity: T;
  #entityUser: E;
  constructor(em: EntityManager, entity: T, entityUser: E) {
    this.#entity = entity;
    this.#em = em;
    this.#entityUser = entityUser;
  }

  async createNew(userId: number): Promise<InstanceType<T>> {
    const duration = luxon.Duration.fromObject({ hour: 1 });
    const now = luxon.DateTime.now();
    const expireAt = now.plus(duration);

    const user: User | Admin = this.#em.getReference(this.#entityUser, userId);

    const session: UserSession | AdminSession = this.#em.create(
      this.#entity,
      {
        expireAt: expireAt.toJSDate(),
        user,
      },
      { partial: true }
    );
    await this.#em.persistAndFlush(session);
    return session as InstanceType<T>;
  }

  findOne(sid: string): Promise<InstanceType<T>> {
    return this.#em.findOneOrFail(
      this.#entity,
      { id: sid },
      { populate: ["user"] }
    ) as Promise<InstanceType<T>>;
  }

  async expireById(sid: string): Promise<InstanceType<T>> {
    const session = this.#em.assign(this.#em.getReference(this.#entity, sid), {
      expireAt: new Date(),
    });
    await this.#em.persistAndFlush(session);
    return session as InstanceType<T>;
  }
}
