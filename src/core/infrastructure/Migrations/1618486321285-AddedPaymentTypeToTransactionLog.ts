import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedPaymentTypeToTransactionLog1618486321285 implements MigrationInterface {
  name = 'AddedPaymentTypeToTransactionLog1618486321285';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderTotalPrice" integer, "shiftId" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "guestCount" integer, "tableId" integer, "status" integer NOT NULL DEFAULT (0), "paymentType" integer NOT NULL)`
    );
    await queryRunner.query(`INSERT INTO "temporary_transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount", "tableId", "status", "paymentType") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount", "tableId", "status",
    CASE
        WHEN paymentMethod = 1 THEN 0
        WHEN paymentMethod = 3 THEN 98
        WHEN paymentmethod = 2 THEN
               CASE
                      WHEN transactiondescription IS NULL THEN 2
                      ELSE 1
               END
        ELSE  paymentmethod
    END paymentType
    FROM "transaction_log"`);
    await queryRunner.query(`DROP TABLE "transaction_log"`);
    await queryRunner.query(`ALTER TABLE "temporary_transaction_log" RENAME TO "transaction_log"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction_log" RENAME TO "temporary_transaction_log"`);
    await queryRunner.query(
      `CREATE TABLE "transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderTotalPrice" integer, "shiftId" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "guestCount" integer, "tableId" integer, "status" integer NOT NULL DEFAULT (0))`
    );
    await queryRunner.query(
      `INSERT INTO "transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount", "tableId", "status") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount", "tableId", "status" FROM "temporary_transaction_log"`
    );
    await queryRunner.query(`DROP TABLE "temporary_transaction_log"`);
  }
}
