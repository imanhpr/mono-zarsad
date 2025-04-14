import {
  GeneratedCacheAdapter,
  Options,
  PostgreSqlDriver,
} from "@mikro-orm/postgresql";
import { SeedManager } from "@mikro-orm/seeder";

const DB_HOST = process.env.MIKRO_ORM_DB_HOST!;
const DB_PORT = process.env.MIKRO_ORM_DB_PORT!;
const DB_NAME = process.env.MIKRO_ORM_DB_NAME!;
const DB_PASSWORD = process.env.MIKRO_ORM_DB_PASSWORD!;
const DB_USER = process.env.MIKRO_ORM_DB_USERNAME!;

const cacheData: unknown = await import("../temp/metadata.json" as string, {
  with: { type: "json" },
});
if (!cacheData) {
  throw new Error(
    "metadata.json is missing – did you forget to run db-cache-generate?"
  );
}
const config: Options = {
  extensions: [SeedManager],
  // for simplicity, we use the SQLite database, as it's available pretty much everywhere
  driver: PostgreSqlDriver,
  metadataCache: {
    enabled: true,
    combined: true,
    adapter: GeneratedCacheAdapter,
    options: { data: cacheData },
  },
  dbName: DB_NAME,
  host: DB_HOST,
  password: DB_PASSWORD,
  user: DB_USER,
  port: parseInt(DB_PORT),
  entities: ["dist/**/*.entity.js"],
};

export default config;
