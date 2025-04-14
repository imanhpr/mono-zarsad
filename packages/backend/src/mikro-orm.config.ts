import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SeedManager } from "@mikro-orm/seeder";

const DB_HOST = process.env.MIKRO_ORM_DB_HOST!;
const DB_PORT = process.env.MIKRO_ORM_DB_PORT!;
const DB_NAME = process.env.MIKRO_ORM_DB_NAME!;
const DB_PASSWORD = process.env.MIKRO_ORM_DB_PASSWORD!;
const DB_USER = process.env.MIKRO_ORM_DB_USERNAME!;

const config: Options = {
  extensions: [SeedManager],
  // for simplicity, we use the SQLite database, as it's available pretty much everywhere
  driver: PostgreSqlDriver,
  dbName: DB_NAME,
  host: DB_HOST,
  password: DB_PASSWORD,
  user: DB_USER,
  port: parseInt(DB_PORT),
  // folder-based discovery setup, using common filename suffix
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  metadataProvider: TsMorphMetadataProvider,
  // enable debug mode to log SQL queries and discovery information
  debug: true,
};

export default config;
