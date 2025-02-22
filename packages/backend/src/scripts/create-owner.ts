import process from "node:process";
import appFactory from "../app-factory.ts";
import { createInterface } from "readline/promises";
import Admin from "../models/Admin.entity.ts";

const readLine = createInterface(process.stdin, process.stdout);
const app = appFactory();
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
