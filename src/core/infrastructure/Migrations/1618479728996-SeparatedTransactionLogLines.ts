import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeparatedTransactionLogLines1618479728996 implements MigrationInterface {
  name = 'SeparatedTransactionLogLines1618479728996';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction_log_order_line" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "totalPrice" integer NOT NULL DEFAULT (0), "stockItemId" integer NOT NULL, "name" varchar NOT NULL, "quantity" integer NOT NULL, "unitPrice" integer NOT NULL, "discountRate" integer, "stockItemIMEI" varchar, "unitOfMeasurement" integer NOT NULL DEFAULT (1), "transactionId" integer, "barcode" varchar)`
    );
    await queryRunner.query(
      `INSERT INTO "transaction_log_order_line" ("totalPrice", "stockItemId", "name", "quantity", "unitPrice", "discountRate", "stockItemIMEI", "unitOfMeasurement", "transactionId", "barcode") SELECT ifnull(json_extract(lo.value, '$.totalPrice'), 0) totalPrice,  json_extract(lo.value, '$.stockItemId') stockItemId, json_extract(lo.value, '$.name') name, json_extract(lo.value, '$.quantity') quantity, json_extract(lo.value, '$.unitPrice') unitPrice, json_extract(lo.value, '$.discountRate') discountRate, json_extract(lo.value, '$.stockItemIMEI') stockItemIMEI, ifnull(json_extract(lo.value, '$.unitOfMeasurement'), 0) unitOfMeasurement, l.id transactionId, json_extract(lo.value, '$.barcode') barcode FROM transaction_log l, json_each(l.orderLines) lo`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderTotalPrice" integer, "shiftId" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "guestCount" integer, "tableId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount", "tableId") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount", "tableId" FROM "transaction_log"`
    );
    await queryRunner.query(`DROP TABLE "transaction_log"`);
    await queryRunner.query(`ALTER TABLE "temporary_transaction_log" RENAME TO "transaction_log"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_transaction_log_order_line" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "totalPrice" integer NOT NULL DEFAULT (0), "stockItemId" integer NOT NULL, "name" varchar NOT NULL, "quantity" integer NOT NULL, "unitPrice" integer NOT NULL, "discountRate" integer, "stockItemIMEI" varchar, "unitOfMeasurement" integer NOT NULL DEFAULT (1), "transactionId" integer, "barcode" varchar, CONSTRAINT "FK_a7f353de0cdf7281b0a22071687" FOREIGN KEY ("transactionId") REFERENCES "transaction_log" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transaction_log_order_line"("id", "totalPrice", "stockItemId", "name", "quantity", "unitPrice", "discountRate", "stockItemIMEI", "unitOfMeasurement", "transactionId", "barcode") SELECT "id", "totalPrice", "stockItemId", "name", "quantity", "unitPrice", "discountRate", "stockItemIMEI", "unitOfMeasurement", "transactionId", "barcode" FROM "transaction_log_order_line"`
    );
    await queryRunner.query(`DROP TABLE "transaction_log_order_line"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_transaction_log_order_line" RENAME TO "transaction_log_order_line"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_log_order_line" RENAME TO "temporary_transaction_log_order_line"`
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_log_order_line" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "totalPrice" integer NOT NULL DEFAULT (0), "stockItemId" integer NOT NULL, "name" varchar NOT NULL, "quantity" integer NOT NULL, "unitPrice" integer NOT NULL, "discountRate" integer, "stockItemIMEI" varchar, "unitOfMeasurement" integer NOT NULL DEFAULT (1), "transactionId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "transaction_log_order_line"("id", "totalPrice", "stockItemId", "name", "quantity", "unitPrice", "discountRate", "stockItemIMEI", "unitOfMeasurement", "transactionId") SELECT "id", "totalPrice", "stockItemId", "name", "quantity", "unitPrice", "discountRate", "stockItemIMEI", "unitOfMeasurement", "transactionId" FROM "temporary_transaction_log_order_line"`
    );
    await queryRunner.query(`DROP TABLE "temporary_transaction_log_order_line"`);
    await queryRunner.query(`ALTER TABLE "transaction_log" RENAME TO "temporary_transaction_log"`);
    await queryRunner.query(
      `CREATE TABLE "transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "orderTotalPrice" integer, "shiftId" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "guestCount" integer, "tableId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "transaction_log"("id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount", "tableId") SELECT "id", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderTotalPrice", "shiftId", "taxAmount", "taxRate", "guestCount", "tableId" FROM "temporary_transaction_log"`
    );
    await queryRunner.query(`DROP TABLE "temporary_transaction_log"`);
    await queryRunner.query(`DROP TABLE "transaction_log_order_line"`);
  }
}
