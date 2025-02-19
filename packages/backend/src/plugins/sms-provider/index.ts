import fp from "fastify-plugin";
import { MelipayamakApi } from "./melipayamak.plugin.ts";
import { ConsoleOtpSender } from "./console-otp.plugin.ts";
import { IOtpSender, IOtpSenderConstructor } from "./types.ts";

export default fp(
  function smsSenderPlugin(fastify, _, done) {
    let otpSender: IOtpSenderConstructor = MelipayamakApi;
    if (fastify.appConfig.NODE_ENV === "development")
      otpSender = ConsoleOtpSender;

    fastify.log.info(
      { provider_name: otpSender.name },
      "sms sender instance init"
    );
    fastify.decorate("sms", new otpSender());
    done();
  },
  {
    name: "smsSenderPlugin",
  }
);

declare module "fastify" {
  interface FastifyInstance {
    sms: IOtpSender;
  }
}
