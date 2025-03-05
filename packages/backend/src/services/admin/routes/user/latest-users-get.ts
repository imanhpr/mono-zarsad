import { FastifyInstance } from "fastify";

export default function getLatestUsersPlugin(
  fastify: FastifyInstance,
  _: Record<string, unknown>,
  done: (err?: Error) => void
) {
  fastify.get("/", async function getLatestUsersHandler() {
    const users = await fastify.userManageService.getLatestUsers();
    return users;
  });
  done();
}
