import vine, { SimpleMessagesProvider } from "@vinejs/vine";
import { errors } from "@vinejs/vine";
import fp from "fastify-plugin";
import axios from "axios";

export default fp(
  function arcCaptchaPlguin(fastify, _, done) {
    const hasVineValidator = fastify.hasDecorator("vineValidator");
    if (!hasVineValidator) throw new Error("Please init vineValidator");

    const arcaptcha_api = "https://api.arcaptcha.ir/arcaptcha/api/verify";
    const arcaptchaTokenSchema = vine.object({
      "arcaptcha-token": vine.string(),
    });
    const schemaTranslation = {
      "arcaptcha-token.required": "لطفا کپچا را به درستی وارد کنید.",
    };
    vine.messagesProvider = new SimpleMessagesProvider(schemaTranslation);

    fastify.addHook<{ Body: { "arcaptcha-token"?: string } }>(
      "preHandler",
      async function arcCaptchaPreHandlerHook(req, rep) {
        let token = req.body["arcaptcha-token"];
        try {
          await fastify.vineValidator(arcaptchaTokenSchema, {
            "arcaptcha-token": token,
          });
        } catch (err) {
          if (err instanceof errors.E_VALIDATION_ERROR) {
            console.log(err.message);
            return rep.code(400).send(err.messages);
          }
          throw err;
        }
        const response = await axios.post(arcaptcha_api, {
          challenge_id: token,
          site_key: "ih2deaht3h",
          secret_key: "ufc7rdwl4pkkxvefn9jq",
        });
        if (response.data.success) return;
        return rep.code(403).send({ error: "captcha validation" });
      }
    );
    done();
  },
  { name: "arcCaptchaPlugin" }
);
