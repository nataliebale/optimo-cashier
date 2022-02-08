import {MigrationInterface, QueryRunner} from "typeorm";

export class Purchases1558431906983 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "purchase_order_line" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderedQuantity" varchar NOT NULL, "expectedUnitCost" decimal NOT NULL, "expectedTotalCost" decimal NOT NULL, "receivedQuantity" integer NOT NULL, "receivedUnitCost" decimal NOT NULL, "receivedTotalCost" decimal NOT NULL, "stockItemId" integer, "purchaseOrderId" integer)`);
        await queryRunner.query(`CREATE TABLE "purchase_order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "locationId" integer NOT NULL, "paymentType" integer NOT NULL, "name" varchar NOT NULL, "orderDate" datetime, "expectedReceiveDate" datetime NOT NULL, "receiveDate" datetime, "status" integer NOT NULL, "expectedTotalCost" decimal NOT NULL, "receivedTotalCost" decimal, "comment" integer NOT NULL, "supplierId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_purchase_order_line" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderedQuantity" varchar NOT NULL, "expectedUnitCost" decimal NOT NULL, "expectedTotalCost" decimal NOT NULL, "receivedQuantity" integer NOT NULL, "receivedUnitCost" decimal NOT NULL, "receivedTotalCost" decimal NOT NULL, "stockItemId" integer, "purchaseOrderId" integer, CONSTRAINT "FK_740abfd3fd124bb4ec5924ee54b" FOREIGN KEY ("stockItemId") REFERENCES "stock_item" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1fd41493ce75a251e0367fac9fb" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_purchase_order_line"("id", "orderedQuantity", "expectedUnitCost", "expectedTotalCost", "receivedQuantity", "receivedUnitCost", "receivedTotalCost", "stockItemId", "purchaseOrderId") SELECT "id", "orderedQuantity", "expectedUnitCost", "expectedTotalCost", "receivedQuantity", "receivedUnitCost", "receivedTotalCost", "stockItemId", "purchaseOrderId" FROM "purchase_order_line"`);
        await queryRunner.query(`DROP TABLE "purchase_order_line"`);
        await queryRunner.query(`ALTER TABLE "temporary_purchase_order_line" RENAME TO "purchase_order_line"`);
        await queryRunner.query(`CREATE TABLE "temporary_purchase_order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "locationId" integer NOT NULL, "paymentType" integer NOT NULL, "name" varchar NOT NULL, "orderDate" datetime, "expectedReceiveDate" datetime NOT NULL, "receiveDate" datetime, "status" integer NOT NULL, "expectedTotalCost" decimal NOT NULL, "receivedTotalCost" decimal, "comment" integer NOT NULL, "supplierId" integer, CONSTRAINT "FK_e4ea5841622429c12889a487f31" FOREIGN KEY ("supplierId") REFERENCES "supplier" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_purchase_order"("id", "locationId", "paymentType", "name", "orderDate", "expectedReceiveDate", "receiveDate", "status", "expectedTotalCost", "receivedTotalCost", "comment", "supplierId") SELECT "id", "locationId", "paymentType", "name", "orderDate", "expectedReceiveDate", "receiveDate", "status", "expectedTotalCost", "receivedTotalCost", "comment", "supplierId" FROM "purchase_order"`);
        await queryRunner.query(`DROP TABLE "purchase_order"`);
        await queryRunner.query(`ALTER TABLE "temporary_purchase_order" RENAME TO "purchase_order"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "purchase_order" RENAME TO "temporary_purchase_order"`);
        await queryRunner.query(`CREATE TABLE "purchase_order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "locationId" integer NOT NULL, "paymentType" integer NOT NULL, "name" varchar NOT NULL, "orderDate" datetime, "expectedReceiveDate" datetime NOT NULL, "receiveDate" datetime, "status" integer NOT NULL, "expectedTotalCost" decimal NOT NULL, "receivedTotalCost" decimal, "comment" integer NOT NULL, "supplierId" integer)`);
        await queryRunner.query(`INSERT INTO "purchase_order"("id", "locationId", "paymentType", "name", "orderDate", "expectedReceiveDate", "receiveDate", "status", "expectedTotalCost", "receivedTotalCost", "comment", "supplierId") SELECT "id", "locationId", "paymentType", "name", "orderDate", "expectedReceiveDate", "receiveDate", "status", "expectedTotalCost", "receivedTotalCost", "comment", "supplierId" FROM "temporary_purchase_order"`);
        await queryRunner.query(`DROP TABLE "temporary_purchase_order"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_line" RENAME TO "temporary_purchase_order_line"`);
        await queryRunner.query(`CREATE TABLE "purchase_order_line" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderedQuantity" varchar NOT NULL, "expectedUnitCost" decimal NOT NULL, "expectedTotalCost" decimal NOT NULL, "receivedQuantity" integer NOT NULL, "receivedUnitCost" decimal NOT NULL, "receivedTotalCost" decimal NOT NULL, "stockItemId" integer, "purchaseOrderId" integer)`);
        await queryRunner.query(`INSERT INTO "purchase_order_line"("id", "orderedQuantity", "expectedUnitCost", "expectedTotalCost", "receivedQuantity", "receivedUnitCost", "receivedTotalCost", "stockItemId", "purchaseOrderId") SELECT "id", "orderedQuantity", "expectedUnitCost", "expectedTotalCost", "receivedQuantity", "receivedUnitCost", "receivedTotalCost", "stockItemId", "purchaseOrderId" FROM "temporary_purchase_order_line"`);
        await queryRunner.query(`DROP TABLE "temporary_purchase_order_line"`);
        await queryRunner.query(`DROP TABLE "purchase_order"`);
        await queryRunner.query(`DROP TABLE "purchase_order_line"`);
    }

}
