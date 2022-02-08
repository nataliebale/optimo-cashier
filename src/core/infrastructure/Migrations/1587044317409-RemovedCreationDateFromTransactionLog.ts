import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedCreationDateFromTransactionLog1587044317409 implements MigrationInterface {
  name = 'RemovedCreationDateFromTransactionLog1587044317409';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_entity_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar NOT NULL DEFAULT (''), "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_entity_transaction_log"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "taxAmount", "taxRate") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "taxAmount", "taxRate" FROM "entity_transaction_log"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "entity_transaction_log"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "temporary_entity_transaction_log" RENAME TO "entity_transaction_log"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "taxAmount", "taxRate") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "taxAmount", "taxRate" FROM "transaction_log"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "transaction_log"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "temporary_transaction_log" RENAME TO "transaction_log"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_check" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "operatorId" integer NOT NULL, "shiftId" integer NOT NULL, "tableId" integer, "guestCount" integer, "products" text NOT NULL, "legalEntityData" text, "basketTotalPrice" integer NOT NULL, "taxRate" integer NOT NULL DEFAULT (0), "taxAmount" integer NOT NULL DEFAULT (0), "totalPrice" integer NOT NULL)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_check"("id", "operatorId", "shiftId", "tableId", "guestCount", "products", "legalEntityData", "basketTotalPrice", "taxRate", "taxAmount", "totalPrice") SELECT "id", "operatorId", "shiftId", "tableId", "guestCount", "products", "legalEntityData", "basketTotalPrice", "taxRate", "taxAmount", "totalPrice" FROM "check"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "check"`, undefined);
    await queryRunner.query(`ALTER TABLE "temporary_check" RENAME TO "check"`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "check" RENAME TO "temporary_check"`, undefined);
    await queryRunner.query(
      `CREATE TABLE "check" ("id" integer PRIMARY KEY NOT NULL, "operatorId" integer NOT NULL, "shiftId" integer NOT NULL, "tableId" integer, "guestCount" integer, "products" text NOT NULL, "legalEntityData" text, "basketTotalPrice" integer NOT NULL, "taxRate" integer NOT NULL DEFAULT (0), "taxAmount" integer NOT NULL DEFAULT (0), "totalPrice" integer NOT NULL)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "check"("id", "operatorId", "shiftId", "tableId", "guestCount", "products", "legalEntityData", "basketTotalPrice", "taxRate", "taxAmount", "totalPrice") SELECT "id", "operatorId", "shiftId", "tableId", "guestCount", "products", "legalEntityData", "basketTotalPrice", "taxRate", "taxAmount", "totalPrice" FROM "temporary_check"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_check"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "transaction_log" RENAME TO "temporary_transaction_log"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "createDate" datetime NOT NULL, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "taxAmount", "taxRate") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "taxAmount", "taxRate" FROM "temporary_transaction_log"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_transaction_log"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "entity_transaction_log" RENAME TO "temporary_entity_transaction_log"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "entity_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "createDate" datetime NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar NOT NULL DEFAULT (''), "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "entity_transaction_log"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "taxAmount", "taxRate") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "taxAmount", "taxRate" FROM "temporary_entity_transaction_log"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_entity_transaction_log"`, undefined);
  }
}
