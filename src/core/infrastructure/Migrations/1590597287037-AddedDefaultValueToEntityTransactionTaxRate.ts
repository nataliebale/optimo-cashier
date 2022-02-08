import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDefaultValueToEntityTransactionTaxRate1590597287037
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "temporary_entity_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar NOT NULL DEFAULT (''), "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "shiftId" integer, "orderTotalPrice" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_entity_transaction"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate" FROM "entity_transaction"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "entity_transaction"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "temporary_entity_transaction" RENAME TO "entity_transaction"`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "entity_transaction" RENAME TO "temporary_entity_transaction"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "entity_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar NOT NULL DEFAULT (''), "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "shiftId" integer, "orderTotalPrice" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "entity_transaction"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate" FROM "temporary_entity_transaction"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_entity_transaction"`, undefined);
  }
}
