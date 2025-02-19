import fp from "fastify-plugin";
import i18next from "i18next";

export default fp(
  async function i18nPlugin(fastify) {
    await i18next.init({
      lng: "fa", // if you're using a language detector, do not define the lng option
      debug: true,
      resources: {
        fa: {
          translation: {
            key: "hello world",
          },
        },
      },
    });
    const res = i18next.t("key");
  },
  { name: "i18nPlugin" }
);
