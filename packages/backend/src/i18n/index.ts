import fp from "fastify-plugin";
import i18next from "i18next";
import fa from "./fa.json" with { type: "json" };

export default fp(
  async function i18nPlugin() {
    await i18next.init({
      lng: "fa", // if you're using a language detector, do not define the lng option
      debug: true,
      resources: {
        fa: {
          translation: fa,
        },
      },
    });
  },
  { name: "i18nPlugin" }
);
