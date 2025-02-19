import axios from "axios";
import fp from "fastify-plugin";

export default fp(
  async function cloudflareCaptchaPlugin(fastify) {
    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const SECRET_KEY = "2x0000000000000000000000000000000AA";

    fastify.addHook(
      "preHandler",
      async function cloudflareCaptchaPreHandlerHook(req, rep) {
        const token = "1234";
        const payload = JSON.stringify({
          secret: SECRET_KEY,
          response: token,
        });

        const result = await axios.post(url, payload, {
          headers: { "Content-Type": "application/json" },
        });
        rep.send(result.data);
      }
    );
  },
  {
    name: "cloudflare-captcha",
  }
);
