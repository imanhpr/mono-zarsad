import fp from "fastify-plugin";
import { EntityClass, EntityManager, FilterQuery } from "@mikro-orm/core";
import User from "../../models/User.entity.ts";
import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginCallback,
} from "fastify";

export abstract class FastifyCrudService<T> {
  #em: EntityManager;
  protected abstract entity: EntityClass<T>;
  constructor(em: EntityManager) {
    this.#em = em;
  }

  findOneById(id: number) {
    return this.#em.findOne(User, { id });
  }

  async createNew(input: object) {
    const obj = this.#em.create(this.entity, input);
    await this.#em.persistAndFlush(obj);
    return obj;
  }

  findByFilter(f: FilterQuery<T>) {
    return this.#em.find(this.entity, f);
  }

  countAll() {
    return this.#em.count(this.#em);
  }

  countByFilter(f: FilterQuery<T>) {
    return this.#em.count(this.#em, f);
  }
}

function fastifyCrudFactory(
  entity: EntityClass<unknown>
): FastifyPluginCallback {
  const cls = class MyCLs extends FastifyCrudService<typeof entity> {
    protected entity: EntityClass<EntityClass<unknown>> = entity;
  };
  const prefix = entity.name.toLowerCase();
  function crudPlugin(
    fastify: FastifyInstance,
    _: Record<string, unknown>,
    done: (err?: Error) => void
  ) {
    const crudServiceInstance = new cls(fastify.orm.em);

    fastify.get(`/${prefix}/$id`, function entityFindOneHandler(req) {
      const id = req.params.id as any;
      return crudServiceInstance.findOneById(id);
    });

    fastify.post(`/${prefix}`, function entityCreateNewHandler(req) {
      const payload = req.body as any;
      crudServiceInstance.createNew(payload);
    });

    fastify.get(`/${prefix}`, function entityFindByFilterHandler(req) {
      const filter = req.query as any;
      return crudServiceInstance.findByFilter(filter);
    });
    fastify.get(`/${prefix}/count`, async function entityCountAllHandler(req) {
      let count: number;
      if (req.query === null && typeof req.query !== "object")
        count = await crudServiceInstance.countAll();
      else {
        count = await crudServiceInstance.countByFilter(req.query);
      }
      return { name: prefix, count };
    });

    done();
  }

  return crudPlugin;
}

export default fp(function fastifyCurdServiceFactory(fastify, _, done) {
  fastify.decorate("crudFactory", fastifyCrudFactory);
  done();
});

declare module "fastify" {
  interface FastifyInstance {
    crudFactory: typeof fastifyCrudFactory;
  }
}
