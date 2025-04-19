import vine from "@vinejs/vine";
import fp from "fastify-plugin";
import { BusinessOperationException } from "../exceptions/index.ts";
import i18next from "i18next";

export const phoneNumberSchema = vine
  .string()
  .mobile({ locale: ["fa-IR"], strictMode: true });

export default fp(
  function phoneNumberVineValidationHook(fastify, _, done) {
    const hasVineValidator = fastify.hasDecorator("vineValidator");
    if (!hasVineValidator) throw new Error("Please register vineValidator");

    fastify.addHook<{ Body: { phoneNumber: string } }>(
      "preHandler",
      async function phoneNumberVineValidatorHook(req) {
        const { phoneNumber } = req.body;
        try {
          await fastify.vineValidator(phoneNumberSchema, phoneNumber);
        } catch (err) {
          req.log.warn({ phoneNumber }, "phoneNumber is invalid.");
          throw new BusinessOperationException(
            400,
            i18next.t("INVALID_PHONE_NUMBER"),
            { phoneNumber }
          );
        }
      }
    );

    done();
  },
  {
    name: "phoneNumberVineValidationHook",
  }
);
