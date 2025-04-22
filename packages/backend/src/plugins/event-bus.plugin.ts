import { Readable } from "node:stream";
import fp from "fastify-plugin";
export default fp(
  function internalEventBusPlugin(fastify, _, done) {
    const readable = new Readable();
    function emitEvent(type: string, payload: Record<string, unknown>) {
      readable.push({ type, payload });
    }

    fastify.decorate("eventBus", readable);
    fastify.decorate("emitEvent", emitEvent);
    done();
  },
  {
    name: "internalEventBusPlugin",
  }
);
