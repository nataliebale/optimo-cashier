import {MigrationInterface, QueryRunner} from "typeorm";

export class SeparatedEntityTransactionLogLines1618992747522 implements MigrationInterface {
    name = 'SeparatedEntityTransactionLogLines1618992747522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "entity_transaction_log_order_line" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "totalPrice" integer NOT NULL DEFAULT (0), "stockItemId" integer NOT NULL, "name" varchar NOT NULL, "quantity" integer NOT NULL, "unitPrice" integer NOT NULL, "discountRate" integer, "stockItemIMEI" varchar, "unitOfMeasurement" integer NOT NULL DEFAULT (1), "transactionId" integer, "barcode" varchar)`);
        await queryRunner.query(`INSERT INTO "entity_transaction_log_order_line" ("totalPrice", "stockItemId", "name", "quantity", "unitPrice", "discountRate", "stockItemIMEI", "unitOfMeasurement", "transactionId", "barcode") SELECT ifnull(json_extract(lo.value, '$.totalPrice'), 0) totalPrice,  json_extract(lo.value, '$.stockItemId') stockItemId, json_extract(lo.value, '$.name') name, json_extract(lo.value, '$.quantity') quantity, json_extract(lo.value, '$.unitPrice') unitPrice, json_extract(lo.value, '$.discountRate') discountRate, json_extract(lo.value, '$.stockItemIMEI') stockItemIMEI, ifnull(json_extract(lo.value, '$.unitOfMeasurement'), 0) unitOfMeasurement, l.id transactionId, json_extract(lo.value, '$.barcode') barcode FROM entity_transaction_log l, json_each(l.orderLines) lo`);
        await queryRunner.query(`CREATE TABLE "temporary_entity_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar, "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "shiftId" integer, "orderTotalPrice" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "entityClientId" integer, "guestCount" integer, "tableId" integer, "status" integer NOT NULL DEFAULT (0), "paymentType" integer)`);
        await queryRunner.query(`INSERT INTO "temporary_entity_transaction_log"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate", "entityClientId", "guestCount", "tableId", "status", "paymentType") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate", "entityClientId", "guestCount", "tableId", "status",
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
        FROM "entity_transaction_log"`);
        await queryRunner.query(`DROP TABLE "entity_transaction_log"`);
        await queryRunner.query(`ALTER TABLE "temporary_entity_transaction_log" RENAME TO "entity_transaction_log"`);
        await queryRunner.query(`CREATE TABLE "temporary_entity_transaction_log_order_line" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "totalPrice" integer NOT NULL DEFAULT (0), "stockItemId" integer NOT NULL, "name" varchar NOT NULL, "quantity" integer NOT NULL, "unitPrice" integer NOT NULL, "discountRate" integer, "stockItemIMEI" varchar, "unitOfMeasurement" integer NOT NULL DEFAULT (1), "transactionId" integer, "barcode" varchar, CONSTRAINT "FK_2d80a1bde18e742fd157d020067" FOREIGN KEY ("transactionId") REFERENCES "transaction_log" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_entity_transaction_log_order_line"("id", "totalPrice", "stockItemId", "name", "quantity", "unitPrice", "discountRate", "stockItemIMEI", "unitOfMeasurement", "transactionId", "barcode") SELECT "id", "totalPrice", "stockItemId", "name", "quantity", "unitPrice", "discountRate", "stockItemIMEI", "unitOfMeasurement", "transactionId", "barcode" FROM "entity_transaction_log_order_line"`);
        await queryRunner.query(`DROP TABLE "entity_transaction_log_order_line"`);
        await queryRunner.query(`ALTER TABLE "temporary_entity_transaction_log_order_line" RENAME TO "entity_transaction_log_order_line"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entity_transaction_log_order_line" RENAME TO "temporary_entity_transaction_log_order_line"`);
        await queryRunner.query(`CREATE TABLE "entity_transaction_log_order_line" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "totalPrice" integer NOT NULL DEFAULT (0), "stockItemId" integer NOT NULL, "name" varchar NOT NULL, "quantity" integer NOT NULL, "unitPrice" integer NOT NULL, "discountRate" integer, "stockItemIMEI" varchar, "unitOfMeasurement" integer NOT NULL DEFAULT (1), "transactionId" integer)`);
        await queryRunner.query(`INSERT INTO "entity_transaction_log_order_line"("id", "totalPrice", "stockItemId", "name", "quantity", "unitPrice", "discountRate", "stockItemIMEI", "unitOfMeasurement", "transactionId") SELECT "id", "totalPrice", "stockItemId", "name", "quantity", "unitPrice", "discountRate", "stockItemIMEI", "unitOfMeasurement", "transactionId" FROM "temporary_entity_transaction_log_order_line"`);
        await queryRunner.query(`DROP TABLE "temporary_entity_transaction_log_order_line"`);
        await queryRunner.query(`ALTER TABLE "entity_transaction_log" RENAME TO "temporary_entity_transaction_log"`);
        await queryRunner.query(`CREATE TABLE "entity_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar, "driverPIN" varchar, "driverName" varchar, "driverCarNumber" varchar, "driverIsForeignСitizen" boolean, "comment" varchar, "shiftId" integer, "orderTotalPrice" integer, "taxAmount" integer NOT NULL DEFAULT (0), "taxRate" integer NOT NULL DEFAULT (0), "entityClientId" integer, "guestCount" integer, "tableId" integer, "status" integer NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "entity_transaction_log"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate", "entityClientId", "guestCount", "tableId", "status") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines", "hasTransportation", "startAddress", "endAddress", "driverPIN", "driverName", "driverCarNumber", "driverIsForeignСitizen", "comment", "shiftId", "orderTotalPrice", "taxAmount", "taxRate", "entityClientId", "guestCount", "tableId", "status" FROM "temporary_entity_transaction_log"`);
        await queryRunner.query(`DROP TABLE "temporary_entity_transaction_log"`);
        await queryRunner.query(`DROP TABLE "entity_transaction_log_order_line"`);
    }

}
