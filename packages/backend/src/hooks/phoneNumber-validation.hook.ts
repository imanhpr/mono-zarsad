import vine from "@vinejs/vine";
import fp from "fastify-plugin";

export const phoneNumberSchema = vine
  .string()
  .mobile({ locale: ["fa-IR"], strictMode: true });

export default fp(
  function phoneNumberVineValidationHook(fastify, _, done) {
    const hasVineValidator = fastify.hasDecorator("vineValidator");
    if (!hasVineValidator) throw new Error("Please register vineValidator");

    fastify.addHook<{ Body: { phoneNumber: string } }>(
      "preHandler",
      async function phoneNumberVineValidatorHook(req, rep) {
        const { phoneNumber } = req.body;
        try {
          await fastify.vineValidator(phoneNumberSchema, phoneNumber);
        } catch (err) {
          req.log.warn({ phoneNumber }, "phoneNumber is invalid.");
          return rep.badRequest("لطفا شماره تلفن معتبر وارد کنید.");
        }
      }
    );

    done();
  },
  {
    name: "phoneNumberVineValidationHook",
  }
);
