import { Migration } from "@mikro-orm/migrations";

export class Migration20250523125743 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "wallet_audit" drop column "source";`);
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "wallet_audit" add column "source" varchar(255) not null;`
    );
  }
}
