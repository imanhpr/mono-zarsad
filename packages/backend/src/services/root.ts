import fp from "fastify-plugin";
import os from "node:os";

export default fp(
  function rootServicePlugin(fastify, _, done) {
    const version = process.env.npm_package_version;
    const name = "Zarsad";
    const response = Object.freeze({ name, version, host: os.hostname() });
    fastify.get("/", async function rootHandler() {
      return response;
    });

    done();
  },
  {
    name: "rootService",
  }
);
