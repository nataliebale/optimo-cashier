import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedChecks1587037787598 implements MigrationInterface {
  name = 'AddedChecks1587037787598';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "check" ("id" integer PRIMARY KEY NOT NULL, "operatorId" integer NOT NULL, "shiftId" integer NOT NULL, "tableId" integer, "guestCount" integer, "products" text NOT NULL, "legalEntityData" text, "basketTotalPrice" integer NOT NULL, "taxRate" integer NOT NULL DEFAULT (0), "taxAmount" integer NOT NULL DEFAULT (0), "totalPrice" integer NOT NULL)`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transaction"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "taxAmount", "taxRate") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "taxAmount", "taxRate" FROM "transaction"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "transaction"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "temporary_transaction" RENAME TO "transaction"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "createDate" datetime NOT NULL, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "createDate", "taxAmount", "taxRate") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "createDate", "taxAmount", "taxRate" FROM "transaction_log"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "transaction_log"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "temporary_transaction_log" RENAME TO "transaction_log"`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_log" RENAME TO "temporary_transaction_log"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "createDate" datetime NOT NULL, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "createDate", "taxAmount", "taxRate") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "createDate", "taxAmount", "taxRate" FROM "temporary_transaction_log"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_transaction_log"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "transaction" RENAME TO "temporary_transaction"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "transaction"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "taxAmount", "taxRate") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "taxAmount", "taxRate" FROM "temporary_transaction"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_transaction"`, undefined);
    await queryRunner.query(`DROP TABLE "check"`, undefined);
  }
}
