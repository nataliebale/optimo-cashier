import {MigrationInterface, QueryRunner} from "typeorm";

export class addStatusOnReturnTransactionLog1623925651759 implements MigrationInterface {
    name = 'addStatusOnReturnTransactionLog1623925651759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_return_transaction_log" ("id" varchar PRIMARY KEY NOT NULL, "returnedTransactionId" varchar NOT NULL, "newTransactionId" varchar, "delistedStockItems" text NOT NULL, "returnDate" datetime NOT NULL, "reason" integer NOT NULL, "status" integer NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_return_transaction_log"("id", "returnedTransactionId", "newTransactionId", "delistedStockItems", "returnDate", "reason", "status") SELECT "id", "returnedTransactionId", "newTransactionId", "delistedStockItems", "returnDate", "reason", 0 FROM "return_transaction_log"`, undefined);
        await queryRunner.query(`DROP TABLE "return_transaction_log"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_return_transaction_log" RENAME TO "return_transaction_log"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "return_transaction_log" RENAME TO "temporary_return_transaction_log"`, undefined);
        await queryRunner.query(`CREATE TABLE "return_transaction_log" ("id" varchar PRIMARY KEY NOT NULL, "returnedTransactionId" varchar NOT NULL, "newTransactionId" varchar, "delistedStockItems" text NOT NULL, "returnDate" datetime NOT NULL, "reason" integer NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "return_transaction_log"("id", "returnedTransactionId", "newTransactionId", "delistedStockItems", "returnDate", "reason") SELECT "id", "returnedTransactionId", "newTransactionId", "delistedStockItems", "returnDate", "reason" FROM "temporary_return_transaction_log"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_return_transaction_log"`, undefined);
    }

}
