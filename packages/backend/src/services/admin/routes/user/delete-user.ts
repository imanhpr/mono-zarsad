import { FastifyInstance } from "fastify";

export default function deleteUserPlugin(
  fastify: FastifyInstance,
  _: unknown,
  done: (err?: Error) => void
) {
  const service = fastify.userManageService;
  fastify.delete("/:id", async function userDeleteHandler(req, rep) {
    // @ts-expect-error
    const { id } = req.params;
    const numberId = Number.parseInt(id);
    if (!Number.isFinite(numberId)) {
      return rep.code(400).send({ error: "please send valid id param" });
    }
    await service.deleteUserById(id as number);
    rep.send({ result: "success" });
  });
  done();
}
