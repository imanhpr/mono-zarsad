import process from "node:process";
import { createInterface } from "readline/promises";
import Admin from "../models/Admin.entity.ts";
import password from "../plugins/password/index.ts";
import Fastify from "fastify";
import mikroOrmPlugin from "../plugins/mikro-orm.plugin.ts";

const readLine = createInterface(process.stdin, process.stdout);
const app = Fastify().register(mikroOrmPlugin).register(password);
await app.ready();
const em = app.orm.em.fork();

const username = await readLine.question("Enter Admin Username:");
const rawPassword = await readLine.question("Enter Admin Password:");
const hsahPassword = await app.passwordService.generateHash(rawPassword);

const admin = em.create(Admin, { password: hsahPassword, username });

await em.persistAndFlush(admin);

console.log(`Admin ${username} has just created successfully`);
await app.orm.close();
await app.close();

process.exit(0);
