import { FastifyInstance } from "fastify";

export default function meGetPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: (err?: Error) => void
) {
  fastify.get(
    "/me",
    {
      preHandler: [fastify.jwtBearerAuth],
      schema: { tags: ["user"], security: [{ userBearerAuth: [] }] },
    },
    function meGetHandler({ user }) {
      return user;
    }
  );
  done();
}
