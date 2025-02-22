import { Buffer } from "node:buffer";
import crypto from "node:crypto";
import util from "node:util";
import fp from "fastify-plugin";

const promisifiedScrypt = util.promisify<
  crypto.BinaryLike,
  crypto.BinaryLike,
  number,
  Buffer
>(crypto.scrypt);
const promisifiedRandomByte = util.promisify(crypto.randomBytes);

class PasswordService {
  serialize(passwordHash: Buffer, salt: Buffer) {
    return `${salt.toString("base64")}.${passwordHash.toString("base64")}`;
  }
  async generateHash(input: string) {
    const salt = await promisifiedRandomByte(12);
    const passwordHash = await promisifiedScrypt(input, salt, 72);
    const res = this.serialize(passwordHash, salt);
    return res;
  }

  async compare(
    inputPassword: string,
    passwordFromDb: string
  ): Promise<boolean> {
    const [saltString, originalPasswordHashString] = passwordFromDb.split(".");
    const salt = Buffer.from(saltString, "base64");
    const originalPasswordHash = Buffer.from(
      originalPasswordHashString,
      "base64"
    );
    const inputPasswordHash = await promisifiedScrypt(inputPassword, salt, 72);
    if (crypto.timingSafeEqual(inputPasswordHash, originalPasswordHash))
      return true;
    return false;
  }
}

export default fp(
  function passwordServicePlugin(fastify, _, done) {
    const passwordService = new PasswordService();
    fastify.decorate("passwordService", passwordService);
    done();
  },
  {
    name: "passwordServicePlugin",
  }
);

declare module "fastify" {
  interface FastifyInstance {
    passwordService: InstanceType<typeof PasswordService>;
  }
}
