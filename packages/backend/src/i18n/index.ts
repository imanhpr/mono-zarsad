import fp from "fastify-plugin";
import i18next from "i18next";
const fa = await import("./fa.json", { with: { type: "json" } });

export default fp<{ debug?: boolean }>(
  async function i18nPlugin(_, config) {
    await i18next.init({
      lng: "fa",
      debug: config.debug || false,
      resources: {
        fa: {
          translation: fa,
        },
      },
    });
  },
  { name: "i18nPlugin" }
);
