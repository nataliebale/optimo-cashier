import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedShiftAndOperatorToReturnOrder1624265100151 implements MigrationInterface {
    name = 'AddedShiftAndOperatorToReturnOrder1624265100151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_return_transaction" ("id" varchar PRIMARY KEY NOT NULL, "returnedTransactionId" varchar NOT NULL, "newTransactionId" varchar, "delistedStockItems" text NOT NULL, "returnDate" datetime NOT NULL, "status" integer NOT NULL, "reason" integer NOT NULL, "operatorId" integer NOT NULL DEFAULT (1), "shiftId" integer NOT NULL DEFAULT (1))`);
        await queryRunner.query(`INSERT INTO "temporary_return_transaction"("id", "returnedTransactionId", "newTransactionId", "delistedStockItems", "returnDate", "status", "reason") SELECT "id", "returnedTransactionId", "newTransactionId", "delistedStockItems", "returnDate", "status", "reason" FROM "return_transaction"`);
        await queryRunner.query(`DROP TABLE "return_transaction"`);
        await queryRunner.query(`ALTER TABLE "temporary_return_transaction" RENAME TO "return_transaction"`);
        await queryRunner.query(`CREATE TABLE "temporary_return_transaction_log" ("id" varchar PRIMARY KEY NOT NULL, "returnedTransactionId" varchar NOT NULL, "newTransactionId" varchar, "delistedStockItems" text NOT NULL, "returnDate" datetime NOT NULL, "reason" integer NOT NULL, "status" integer NOT NULL, "operatorId" integer NOT NULL DEFAULT (1), "shiftId" integer NOT NULL DEFAULT (1))`);
        await queryRunner.query(`INSERT INTO "temporary_return_transaction_log"("id", "returnedTransactionId", "newTransactionId", "delistedStockItems", "returnDate", "reason", "status") SELECT "id", "returnedTransactionId", "newTransactionId", "delistedStockItems", "returnDate", "reason", "status" FROM "return_transaction_log"`);
        await queryRunner.query(`DROP TABLE "return_transaction_log"`);
        await queryRunner.query(`ALTER TABLE "temporary_return_transaction_log" RENAME TO "return_transaction_log"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "return_transaction_log" RENAME TO "temporary_return_transaction_log"`);
        await queryRunner.query(`CREATE TABLE "return_transaction_log" ("id" varchar PRIMARY KEY NOT NULL, "returnedTransactionId" varchar NOT NULL, "newTransactionId" varchar, "delistedStockItems" text NOT NULL, "returnDate" datetime NOT NULL, "reason" integer NOT NULL, "status" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "return_transaction_log"("id", "returnedTransactionId", "newTransactionId", "delistedStockItems", "returnDate", "reason", "status") SELECT "id", "returnedTransactionId", "newTransactionId", "delistedStockItems", "returnDate", "reason", "status" FROM "temporary_return_transaction_log"`);
        await queryRunner.query(`DROP TABLE "temporary_return_transaction_log"`);
        await queryRunner.query(`ALTER TABLE "return_transaction" RENAME TO "temporary_return_transaction"`);
        await queryRunner.query(`CREATE TABLE "return_transaction" ("id" varchar PRIMARY KEY NOT NULL, "returnedTransactionId" varchar NOT NULL, "newTransactionId" varchar, "delistedStockItems" text NOT NULL, "returnDate" datetime NOT NULL, "status" integer NOT NULL, "reason" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "return_transaction"("id", "returnedTransactionId", "newTransactionId", "delistedStockItems", "returnDate", "status", "reason") SELECT "id", "returnedTransactionId", "newTransactionId", "delistedStockItems", "returnDate", "status", "reason" FROM "temporary_return_transaction"`);
        await queryRunner.query(`DROP TABLE "temporary_return_transaction"`);
    }

}
