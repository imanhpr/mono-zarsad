import vine from "@vinejs/vine";
import fp from "fastify-plugin";
import axios from "axios";

export default fp(
  function arcCaptchaPlguin(fastify, _, done) {
    const hasVineValidator = fastify.hasDecorator("vineValidator");
    if (!hasVineValidator) throw new Error("Please init vineValidator");

    const arcaptcha_api = "https://api.arcaptcha.ir/arcaptcha/api/verify";
    const arcaptchaTokenSchema = vine.string();
    fastify.addHook<{ Body: { "arcaptcha-token"?: string } }>(
      "preHandler",
      async function arcCaptchaPreHandlerHook(req, rep) {
        let token = req.body["arcaptcha-token"];
        token = await fastify.vineValidator(arcaptchaTokenSchema, token);
        const response = await axios.post(arcaptcha_api, {
          challenge_id: token,
          site_key: "ih2deaht3h",
          secret_key: "ufc7rdwl4pkkxvefn9jq",
        });
        console.log("response", response.data);
        if (response.data.success) return;
        return rep.code(403).send({ error: "captcha validation" });
      }
    );
    done();
  },
  { name: "arcCaptchaPlugin" }
);
