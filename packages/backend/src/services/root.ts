import fp from "fastify-plugin";
import os from "node:os";

import { Type } from "@sinclair/typebox";

const RootSuccessResponse = Type.Object({
  version: Type.String({ description: "Current version of the software" }),
  name: Type.String({ describe: "The project name" }),
  host: Type.String({ description: "The host name" }),
});

export default fp(
  function rootServicePlugin(fastify, _, done) {
    const version = process.env.npm_package_version;
    const name = "Zarsad";
    const response = Object.freeze({ name, version, host: os.hostname() });
    fastify.get(
      "/",
      {
        schema: {
          tags: ["root"],
          description: "Root path for testing and some general information.",
          response: {
            200: RootSuccessResponse,
          },
        },
      },
      async function rootHandler() {
        return response;
      }
    );

    done();
  },
  {
    name: "rootService",
  }
);
