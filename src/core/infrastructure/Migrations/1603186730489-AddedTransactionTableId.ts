import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedTransactionTableId1603186730489 implements MigrationInterface {
    name = 'AddedTransactionTableId1603186730489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "orderTotalPrice" integer, "shiftId" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "paymentType" integer, "guestCount" integer, "tableId" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_transaction"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "paymentType", "guestCount") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "paymentType", "guestCount" FROM "transaction"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`ALTER TABLE "temporary_transaction" RENAME TO "transaction"`);
        await queryRunner.query(`CREATE TABLE "temporary_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "orderTotalPrice" integer, "shiftId" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "guestCount" integer, "tableId" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount" FROM "transaction_log"`);
        await queryRunner.query(`DROP TABLE "transaction_log"`);
        await queryRunner.query(`ALTER TABLE "temporary_transaction_log" RENAME TO "transaction_log"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_log" RENAME TO "temporary_transaction_log"`);
        await queryRunner.query(`CREATE TABLE "transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "orderTotalPrice" integer, "shiftId" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "guestCount" integer)`);
        await queryRunner.query(`INSERT INTO "transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount" FROM "temporary_transaction_log"`);
        await queryRunner.query(`DROP TABLE "temporary_transaction_log"`);
        await queryRunner.query(`ALTER TABLE "transaction" RENAME TO "temporary_transaction"`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "orderTotalPrice" integer, "shiftId" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "paymentType" integer, "guestCount" integer)`);
        await queryRunner.query(`INSERT INTO "transaction"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "paymentType", "guestCount") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "paymentType", "guestCount" FROM "temporary_transaction"`);
        await queryRunner.query(`DROP TABLE "temporary_transaction"`);
    }

}
