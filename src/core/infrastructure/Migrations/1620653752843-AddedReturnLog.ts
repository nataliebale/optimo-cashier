import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedReturnLog1620653752843 implements MigrationInterface {
    name = 'AddedReturnLog1620653752843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "return_transaction" ("id" varchar PRIMARY KEY NOT NULL, "returnedTransactionId" varchar NOT NULL, "newTransactionId" varchar, "delistedStockItems" text NOT NULL, "returnDate" datetime NOT NULL, "status" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "return_transaction_log" ("id" varchar PRIMARY KEY NOT NULL, "returnedTransactionId" varchar NOT NULL, "newTransactionId" varchar, "delistedStockItems" text NOT NULL, "returnDate" datetime NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_check" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "operatorId" integer NOT NULL, "shiftId" integer NOT NULL, "tableId" integer, "guestCount" integer, "products" text NOT NULL, "legalEntityData" text, "basketTotalPrice" integer NOT NULL, "taxRate" integer NOT NULL DEFAULT (0), "taxAmount" integer NOT NULL DEFAULT (0), "totalPrice" integer NOT NULL, "creationDate" datetime, "orderId" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_check"("id", "operatorId", "shiftId", "tableId", "guestCount", "products", "legalEntityData", "basketTotalPrice", "taxRate", "taxAmount", "totalPrice", "creationDate") SELECT "id", "operatorId", "shiftId", "tableId", "guestCount", "products", "legalEntityData", "basketTotalPrice", "taxRate", "taxAmount", "totalPrice", "creationDate" FROM "check"`);
        await queryRunner.query(`DROP TABLE "check"`);
        await queryRunner.query(`ALTER TABLE "temporary_check" RENAME TO "check"`);
        await queryRunner.query(`CREATE TABLE "temporary_entity_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar, "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "shiftId" integer, "orderTotalPrice" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "paymentType" integer, "entityClientId" integer, "guestCount" integer, "tableId" integer, "externalId" varchar, "canBeReversed" boolean NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "temporary_entity_transaction"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate", "paymentType", "entityClientId", "guestCount", "tableId") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate", "paymentType", "entityClientId", "guestCount", "tableId" FROM "entity_transaction"`);
        await queryRunner.query(`DROP TABLE "entity_transaction"`);
        await queryRunner.query(`ALTER TABLE "temporary_entity_transaction" RENAME TO "entity_transaction"`);
        await queryRunner.query(`CREATE TABLE "temporary_entity_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar, "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "shiftId" integer, "orderTotalPrice" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "entityClientId" integer, "guestCount" integer, "tableId" integer, "status" integer NOT NULL DEFAULT (0), "paymentType" integer, "externalId" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_entity_transaction_log"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate", "entityClientId", "guestCount", "tableId", "status", "paymentType") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate", "entityClientId", "guestCount", "tableId", "status", "paymentType" FROM "entity_transaction_log"`);
        await queryRunner.query(`DROP TABLE "entity_transaction_log"`);
        await queryRunner.query(`ALTER TABLE "temporary_entity_transaction_log" RENAME TO "entity_transaction_log"`);
        await queryRunner.query(`CREATE TABLE "temporary_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "orderTotalPrice" integer, "shiftId" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "paymentType" integer, "guestCount" integer, "tableId" integer, "externalId" varchar, "canBeReversed" boolean NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "temporary_transaction"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "paymentType", "guestCount", "tableId") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "paymentType", "guestCount", "tableId" FROM "transaction"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`ALTER TABLE "temporary_transaction" RENAME TO "transaction"`);
        await queryRunner.query(`CREATE TABLE "temporary_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderTotalPrice" integer, "shiftId" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "guestCount" integer, "tableId" integer, "status" integer NOT NULL DEFAULT (0), "paymentType" integer NOT NULL, "externalId" varchar, "canBeReversed" boolean NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "temporary_transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount", "tableId", "status", "paymentType") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount", "tableId", "status", "paymentType" FROM "transaction_log"`);
        await queryRunner.query(`DROP TABLE "transaction_log"`);
        await queryRunner.query(`ALTER TABLE "temporary_transaction_log" RENAME TO "transaction_log"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_log" RENAME TO "temporary_transaction_log"`);
        await queryRunner.query(`CREATE TABLE "transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderTotalPrice" integer, "shiftId" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "guestCount" integer, "tableId" integer, "status" integer NOT NULL DEFAULT (0), "paymentType" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount", "tableId", "status", "paymentType") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount", "tableId", "status", "paymentType" FROM "temporary_transaction_log"`);
        await queryRunner.query(`DROP TABLE "temporary_transaction_log"`);
        await queryRunner.query(`ALTER TABLE "transaction" RENAME TO "temporary_transaction"`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "orderTotalPrice" integer, "shiftId" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "paymentType" integer, "guestCount" integer, "tableId" integer)`);
        await queryRunner.query(`INSERT INTO "transaction"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "paymentType", "guestCount", "tableId") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "paymentType", "guestCount", "tableId" FROM "temporary_transaction"`);
        await queryRunner.query(`DROP TABLE "temporary_transaction"`);
        await queryRunner.query(`ALTER TABLE "entity_transaction_log" RENAME TO "temporary_entity_transaction_log"`);
        await queryRunner.query(`CREATE TABLE "entity_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar, "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "shiftId" integer, "orderTotalPrice" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "entityClientId" integer, "guestCount" integer, "tableId" integer, "status" integer NOT NULL DEFAULT (0), "paymentType" integer)`);
        await queryRunner.query(`INSERT INTO "entity_transaction_log"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate", "entityClientId", "guestCount", "tableId", "status", "paymentType") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate", "entityClientId", "guestCount", "tableId", "status", "paymentType" FROM "temporary_entity_transaction_log"`);
        await queryRunner.query(`DROP TABLE "temporary_entity_transaction_log"`);
        await queryRunner.query(`ALTER TABLE "entity_transaction" RENAME TO "temporary_entity_transaction"`);
        await queryRunner.query(`CREATE TABLE "entity_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar, "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "shiftId" integer, "orderTotalPrice" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "paymentType" integer, "entityClientId" integer, "guestCount" integer, "tableId" integer)`);
        await queryRunner.query(`INSERT INTO "entity_transaction"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate", "paymentType", "entityClientId", "guestCount", "tableId") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate", "paymentType", "entityClientId", "guestCount", "tableId" FROM "temporary_entity_transaction"`);
        await queryRunner.query(`DROP TABLE "temporary_entity_transaction"`);
        await queryRunner.query(`ALTER TABLE "check" RENAME TO "temporary_check"`);
        await queryRunner.query(`CREATE TABLE "check" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "operatorId" integer NOT NULL, "shiftId" integer NOT NULL, "tableId" integer, "guestCount" integer, "products" text NOT NULL, "legalEntityData" text, "basketTotalPrice" integer NOT NULL, "taxRate" integer NOT NULL DEFAULT (0), "taxAmount" integer NOT NULL DEFAULT (0), "totalPrice" integer NOT NULL, "creationDate" datetime)`);
        await queryRunner.query(`INSERT INTO "check"("id", "operatorId", "shiftId", "tableId", "guestCount", "products", "legalEntityData", "basketTotalPrice", "taxRate", "taxAmount", "totalPrice", "creationDate") SELECT "id", "operatorId", "shiftId", "tableId", "guestCount", "products", "legalEntityData", "basketTotalPrice", "taxRate", "taxAmount", "totalPrice", "creationDate" FROM "temporary_check"`);
        await queryRunner.query(`DROP TABLE "temporary_check"`);
        await queryRunner.query(`DROP TABLE "return_transaction_log"`);
        await queryRunner.query(`DROP TABLE "return_transaction"`);
    }

}
