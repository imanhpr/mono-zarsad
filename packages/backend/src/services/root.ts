import fp from "fastify-plugin";

export default fp(
  function rootServicePlugin(fastify, _, done) {
    const version = process.env.npm_package_version;
    const name = "Zarsad";
    const response = Object.freeze({ name, version });
    fastify.get("/", async function rootHandler() {
      return response;
    });

    done();
  },
  {
    name: "rootService",
  }
);
