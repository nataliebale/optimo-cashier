import {MigrationInterface, QueryRunner} from "typeorm";

export class ReceivePurchase1559206656105 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "received_purchase_order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "receiveDate" datetime NOT NULL, "orderLines" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "received_purchase_order_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createDate" datetime NOT NULL, "receiveDate" datetime NOT NULL, "orderLines" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "createDate" datetime NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines" FROM "transaction_log"`);
        await queryRunner.query(`DROP TABLE "transaction_log"`);
        await queryRunner.query(`ALTER TABLE "temporary_transaction_log" RENAME TO "transaction_log"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "transaction_log" RENAME TO "temporary_transaction_log"`);
        await queryRunner.query(`CREATE TABLE "transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL)`);
        await queryRunner.query(`INSERT INTO "transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines" FROM "temporary_transaction_log"`);
        await queryRunner.query(`DROP TABLE "temporary_transaction_log"`);
        await queryRunner.query(`DROP TABLE "received_purchase_order_log"`);
        await queryRunner.query(`DROP TABLE "received_purchase_order"`);
    }

}
