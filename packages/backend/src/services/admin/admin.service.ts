import fp from "fastify-plugin";
import type { AdminRepo } from "../../repository/Admin.repo.ts";

export class AdminService {
  #repo: AdminRepo;

  constructor(repo: AdminRepo) {
    this.#repo = repo;
  }
}

export default fp(
  function adminServicePlugin(fastify, _, done) {
    const hasAdminRepo = fastify.hasDecorator("adminRepo");

    if (!hasAdminRepo) throw new Error("Please init admin repo");
    const adminService = new AdminService(fastify.adminRepo);

    fastify.decorate("adminService", adminService);
    done();
  },
  { name: "adminServicePlugin" }
);

declare module "fastify" {
  interface FastifyInstance {
    adminService: InstanceType<typeof AdminService>;
  }
}
