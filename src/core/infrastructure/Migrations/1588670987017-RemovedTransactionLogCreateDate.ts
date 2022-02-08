import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedTransactionLogCreateDate1588670987017 implements MigrationInterface {
    name = 'RemovedTransactionLogCreateDate1588670987017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines" FROM "transaction_log"`, undefined);
        await queryRunner.query(`DROP TABLE "transaction_log"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_transaction_log" RENAME TO "transaction_log"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_log" RENAME TO "temporary_transaction_log"`, undefined);
        await queryRunner.query(`CREATE TABLE "transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "createDate" datetime NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines" FROM "temporary_transaction_log"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_transaction_log"`, undefined);
    }

}
