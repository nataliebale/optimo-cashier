import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixeHorecaDB1588857690523 implements MigrationInterface {
  name = 'FixeHorecaDB1588857690523';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_entity_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar NOT NULL DEFAULT (''), "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "shiftId" integer, "orderTotalPrice" integer)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_entity_transaction_log"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice" FROM "entity_transaction_log"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "entity_transaction_log"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "temporary_entity_transaction_log" RENAME TO "entity_transaction_log"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "orderTotalPrice" integer, "shiftId" integer)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId" FROM "transaction_log"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "transaction_log"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "temporary_transaction_log" RENAME TO "transaction_log"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_entity_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar NOT NULL DEFAULT (''), "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "shiftId" integer, "orderTotalPrice" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_entity_transaction"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice" FROM "entity_transaction"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "entity_transaction"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "temporary_entity_transaction" RENAME TO "entity_transaction"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_entity_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar NOT NULL DEFAULT (''), "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "shiftId" integer, "orderTotalPrice" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_entity_transaction_log"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice" FROM "entity_transaction_log"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "entity_transaction_log"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "temporary_entity_transaction_log" RENAME TO "entity_transaction_log"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "orderTotalPrice" integer, "shiftId" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transaction"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId" FROM "transaction"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "transaction"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "temporary_transaction" RENAME TO "transaction"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "orderTotalPrice" integer, "shiftId" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId" FROM "transaction_log"`,
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
      `CREATE TABLE "transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "orderTotalPrice" integer, "shiftId" integer)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId" FROM "temporary_transaction_log"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_transaction_log"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "transaction" RENAME TO "temporary_transaction"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "orderTotalPrice" integer, "shiftId" integer)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "transaction"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId" FROM "temporary_transaction"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_transaction"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "entity_transaction_log" RENAME TO "temporary_entity_transaction_log"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "entity_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar NOT NULL DEFAULT (''), "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "shiftId" integer, "orderTotalPrice" integer)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "entity_transaction_log"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice" FROM "temporary_entity_transaction_log"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_entity_transaction_log"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "entity_transaction" RENAME TO "temporary_entity_transaction"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "entity_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar NOT NULL DEFAULT (''), "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "shiftId" integer, "orderTotalPrice" integer)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "entity_transaction"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice" FROM "temporary_entity_transaction"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_entity_transaction"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "transaction_log" RENAME TO "temporary_transaction_log"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "createDate" datetime NOT NULL, "orderTotalPrice" integer, "shiftId" integer)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId" FROM "temporary_transaction_log"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_transaction_log"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "entity_transaction_log" RENAME TO "temporary_entity_transaction_log"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "entity_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "createDate" datetime NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar NOT NULL DEFAULT (''), "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "shiftId" integer, "orderTotalPrice" integer)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "entity_transaction_log"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice" FROM "temporary_entity_transaction_log"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_entity_transaction_log"`, undefined);
  }
}
