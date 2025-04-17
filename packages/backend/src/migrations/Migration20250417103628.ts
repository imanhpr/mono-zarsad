import { Migration } from '@mikro-orm/migrations';

export class Migration20250417103628 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "admin" ("id" serial primary key, "username" varchar(255) not null, "password" varchar(255) not null);`);
    this.addSql(`alter table "admin" add constraint "admin_username_unique" unique ("username");`);

    this.addSql(`create table "admin_session" ("id" uuid not null, "user_id" int not null, "created_at" timestamptz not null, "expire_at" timestamptz not null, constraint "admin_session_pkey" primary key ("id"));`);

    this.addSql(`create table "currency_type" ("id" serial primary key, "name" varchar(255) not null, "name_farsi" varchar(255) not null);`);

    this.addSql(`create table "profile" ("id" serial primary key, "debt_prem" boolean not null default false);`);

    this.addSql(`create table "spread" ("id" serial primary key, "sell" numeric(21,3) not null, "buy" numeric(21,3) not null, "created_at" timestamptz not null);`);

    this.addSql(`create table "currency_price" ("id" serial primary key, "price" numeric(10,0) not null, "created_at" timestamptz not null, "currency_id" int not null, "spread_id" int not null);`);
    this.addSql(`alter table "currency_price" add constraint "currency_price_spread_id_unique" unique ("spread_id");`);

    this.addSql(`create table "system_info" ("id" varchar(255) not null, "value" jsonb null, constraint "system_info_pkey" primary key ("id"));`);

    this.addSql(`create table "user" ("id" serial primary key, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "phone_number" varchar(255) not null, "national_code" varchar(255) not null, "profile_id" int null, "created_at" timestamptz null);`);
    this.addSql(`alter table "user" add constraint "user_profile_id_unique" unique ("profile_id");`);

    this.addSql(`create table "user_session" ("id" uuid not null, "user_id" int not null, "created_at" timestamptz not null, "expire_at" timestamptz not null, constraint "user_session_pkey" primary key ("id"));`);

    this.addSql(`create table "wallet" ("id" serial primary key, "currency_type_id" int not null, "amount" numeric(21,3) not null, "lock_amount" numeric(21,3) not null, "user_id" int not null);`);

    this.addSql(`create table "wallet_transaction" ("id" varchar(255) not null, "type" varchar(255) not null, "is_lockable" boolean not null, "is_lock" boolean not null, "created_at" timestamptz not null, constraint "wallet_transaction_pkey" primary key ("id"));`);

    this.addSql(`create table "wallet_to_wallet_transaction" ("id_id" varchar(255) not null, "created_at" timestamptz not null, constraint "wallet_to_wallet_transaction_pkey" primary key ("id_id"));`);

    this.addSql(`create table "wallet_simple_transaction" ("transaction_id" varchar(255) not null, "type" text check ("type" in ('CARD_TO_CARD', 'PHYSICAL_GOLD_WITHDRAW', 'TOMAN_WITHDRAW')) not null, "wallet_id" int not null, "bank_transaction_id" varchar(255) not null, "amount" numeric(21,3) not null, "status" text check ("status" in ('SUCCESSFUL', 'INIT')) not null, "created_at" timestamptz not null, constraint "wallet_simple_transaction_pkey" primary key ("transaction_id"));`);
    this.addSql(`alter table "wallet_simple_transaction" add constraint "wallet_simple_transaction_bank_transaction_id_unique" unique ("bank_transaction_id");`);

    this.addSql(`create table "wallet_audit" ("id" serial primary key, "type" varchar(255) not null, "amount" numeric(21,3) not null, "lock" numeric(21,3) not null, "lock_amount" numeric(21,3) not null, "wallet_amount" numeric(21,3) not null, "created_at" timestamptz not null, "source" varchar(255) not null, "currency_type_id" int not null, "wallet_id" int not null, "wallet_transaction_id" varchar(255) not null);`);

    this.addSql(`create table "wallet_exchange_pair_transaction" ("id_id" varchar(255) not null, "increment_id" int null, "decrement_id" int null, "from_currency_id" int not null, "to_currency_id" int not null, "from_wallet_id" int not null, "to_wallet_id" int not null, "currency_price_id" int not null, "from_value" numeric(21,3) not null, "to_value" numeric(21,3) not null, "status" text check ("status" in ('INIT', 'SUCCESSFUL', 'CANCEL_BY_USER', 'CANCEL_BY_ADMIN')) not null default 'INIT', "created_at" timestamptz not null, "finalize_at" timestamptz null, constraint "wallet_exchange_pair_transaction_pkey" primary key ("id_id"));`);

    this.addSql(`alter table "admin_session" add constraint "admin_session_user_id_foreign" foreign key ("user_id") references "admin" ("id") on update cascade;`);

    this.addSql(`alter table "currency_price" add constraint "currency_price_currency_id_foreign" foreign key ("currency_id") references "currency_type" ("id") on update cascade;`);
    this.addSql(`alter table "currency_price" add constraint "currency_price_spread_id_foreign" foreign key ("spread_id") references "spread" ("id") on update cascade;`);

    this.addSql(`alter table "user" add constraint "user_profile_id_foreign" foreign key ("profile_id") references "profile" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "user_session" add constraint "user_session_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "wallet" add constraint "wallet_currency_type_id_foreign" foreign key ("currency_type_id") references "currency_type" ("id") on update cascade;`);
    this.addSql(`alter table "wallet" add constraint "wallet_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "wallet_to_wallet_transaction" add constraint "wallet_to_wallet_transaction_id_id_foreign" foreign key ("id_id") references "wallet_transaction" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "wallet_simple_transaction" add constraint "wallet_simple_transaction_transaction_id_foreign" foreign key ("transaction_id") references "wallet_transaction" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "wallet_simple_transaction" add constraint "wallet_simple_transaction_wallet_id_foreign" foreign key ("wallet_id") references "wallet" ("id") on update cascade;`);

    this.addSql(`alter table "wallet_audit" add constraint "wallet_audit_currency_type_id_foreign" foreign key ("currency_type_id") references "currency_type" ("id") on update cascade;`);
    this.addSql(`alter table "wallet_audit" add constraint "wallet_audit_wallet_id_foreign" foreign key ("wallet_id") references "wallet" ("id") on update cascade;`);
    this.addSql(`alter table "wallet_audit" add constraint "wallet_audit_wallet_transaction_id_foreign" foreign key ("wallet_transaction_id") references "wallet_transaction" ("id") on update cascade;`);

    this.addSql(`alter table "wallet_exchange_pair_transaction" add constraint "wallet_exchange_pair_transaction_id_id_foreign" foreign key ("id_id") references "wallet_transaction" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "wallet_exchange_pair_transaction" add constraint "wallet_exchange_pair_transaction_increment_id_foreign" foreign key ("increment_id") references "wallet_audit" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "wallet_exchange_pair_transaction" add constraint "wallet_exchange_pair_transaction_decrement_id_foreign" foreign key ("decrement_id") references "wallet_audit" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "wallet_exchange_pair_transaction" add constraint "wallet_exchange_pair_transaction_from_currency_id_foreign" foreign key ("from_currency_id") references "currency_type" ("id") on update cascade;`);
    this.addSql(`alter table "wallet_exchange_pair_transaction" add constraint "wallet_exchange_pair_transaction_to_currency_id_foreign" foreign key ("to_currency_id") references "currency_type" ("id") on update cascade;`);
    this.addSql(`alter table "wallet_exchange_pair_transaction" add constraint "wallet_exchange_pair_transaction_from_wallet_id_foreign" foreign key ("from_wallet_id") references "wallet" ("id") on update cascade;`);
    this.addSql(`alter table "wallet_exchange_pair_transaction" add constraint "wallet_exchange_pair_transaction_to_wallet_id_foreign" foreign key ("to_wallet_id") references "wallet" ("id") on update cascade;`);
    this.addSql(`alter table "wallet_exchange_pair_transaction" add constraint "wallet_exchange_pair_transaction_currency_price_id_foreign" foreign key ("currency_price_id") references "currency_price" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "admin_session" drop constraint "admin_session_user_id_foreign";`);

    this.addSql(`alter table "currency_price" drop constraint "currency_price_currency_id_foreign";`);

    this.addSql(`alter table "wallet" drop constraint "wallet_currency_type_id_foreign";`);

    this.addSql(`alter table "wallet_audit" drop constraint "wallet_audit_currency_type_id_foreign";`);

    this.addSql(`alter table "wallet_exchange_pair_transaction" drop constraint "wallet_exchange_pair_transaction_from_currency_id_foreign";`);

    this.addSql(`alter table "wallet_exchange_pair_transaction" drop constraint "wallet_exchange_pair_transaction_to_currency_id_foreign";`);

    this.addSql(`alter table "user" drop constraint "user_profile_id_foreign";`);

    this.addSql(`alter table "currency_price" drop constraint "currency_price_spread_id_foreign";`);

    this.addSql(`alter table "wallet_exchange_pair_transaction" drop constraint "wallet_exchange_pair_transaction_currency_price_id_foreign";`);

    this.addSql(`alter table "user_session" drop constraint "user_session_user_id_foreign";`);

    this.addSql(`alter table "wallet" drop constraint "wallet_user_id_foreign";`);

    this.addSql(`alter table "wallet_simple_transaction" drop constraint "wallet_simple_transaction_wallet_id_foreign";`);

    this.addSql(`alter table "wallet_audit" drop constraint "wallet_audit_wallet_id_foreign";`);

    this.addSql(`alter table "wallet_exchange_pair_transaction" drop constraint "wallet_exchange_pair_transaction_from_wallet_id_foreign";`);

    this.addSql(`alter table "wallet_exchange_pair_transaction" drop constraint "wallet_exchange_pair_transaction_to_wallet_id_foreign";`);

    this.addSql(`alter table "wallet_to_wallet_transaction" drop constraint "wallet_to_wallet_transaction_id_id_foreign";`);

    this.addSql(`alter table "wallet_simple_transaction" drop constraint "wallet_simple_transaction_transaction_id_foreign";`);

    this.addSql(`alter table "wallet_audit" drop constraint "wallet_audit_wallet_transaction_id_foreign";`);

    this.addSql(`alter table "wallet_exchange_pair_transaction" drop constraint "wallet_exchange_pair_transaction_id_id_foreign";`);

    this.addSql(`alter table "wallet_exchange_pair_transaction" drop constraint "wallet_exchange_pair_transaction_increment_id_foreign";`);

    this.addSql(`alter table "wallet_exchange_pair_transaction" drop constraint "wallet_exchange_pair_transaction_decrement_id_foreign";`);

    this.addSql(`drop table if exists "admin" cascade;`);

    this.addSql(`drop table if exists "admin_session" cascade;`);

    this.addSql(`drop table if exists "currency_type" cascade;`);

    this.addSql(`drop table if exists "profile" cascade;`);

    this.addSql(`drop table if exists "spread" cascade;`);

    this.addSql(`drop table if exists "currency_price" cascade;`);

    this.addSql(`drop table if exists "system_info" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "user_session" cascade;`);

    this.addSql(`drop table if exists "wallet" cascade;`);

    this.addSql(`drop table if exists "wallet_transaction" cascade;`);

    this.addSql(`drop table if exists "wallet_to_wallet_transaction" cascade;`);

    this.addSql(`drop table if exists "wallet_simple_transaction" cascade;`);

    this.addSql(`drop table if exists "wallet_audit" cascade;`);

    this.addSql(`drop table if exists "wallet_exchange_pair_transaction" cascade;`);
  }

}
