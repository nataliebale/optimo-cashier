import {MigrationInterface, QueryRunner} from "typeorm";

export class paymenMethod1565007547150 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_purchase_order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "locationId" integer NOT NULL, "paymentMethod" integer NOT NULL, "name" varchar NOT NULL, "orderDate" datetime, "expectedReceiveDate" datetime NOT NULL, "receiveDate" datetime, "status" integer NOT NULL, "expectedTotalCost" decimal NOT NULL, "receivedTotalCost" decimal, "comment" integer NOT NULL, "supplierId" integer, CONSTRAINT "FK_e4ea5841622429c12889a487f31" FOREIGN KEY ("supplierId") REFERENCES "supplier" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_purchase_order"("id", "locationId", "paymentMethod", "name", "orderDate", "expectedReceiveDate", "receiveDate", "status", "expectedTotalCost", "receivedTotalCost", "comment", "supplierId") SELECT "id", "locationId", "paymentType", "name", "orderDate", "expectedReceiveDate", "receiveDate", "status", "expectedTotalCost", "receivedTotalCost", "comment", "supplierId" FROM "purchase_order"`);
        await queryRunner.query(`DROP TABLE "purchase_order"`);
        await queryRunner.query(`ALTER TABLE "temporary_purchase_order" RENAME TO "purchase_order"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "purchase_order" RENAME TO "temporary_purchase_order"`);
        await queryRunner.query(`CREATE TABLE "purchase_order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "locationId" integer NOT NULL, "paymentType" integer NOT NULL, "name" varchar NOT NULL, "orderDate" datetime, "expectedReceiveDate" datetime NOT NULL, "receiveDate" datetime, "status" integer NOT NULL, "expectedTotalCost" decimal NOT NULL, "receivedTotalCost" decimal, "comment" integer NOT NULL, "supplierId" integer, CONSTRAINT "FK_e4ea5841622429c12889a487f31" FOREIGN KEY ("supplierId") REFERENCES "supplier" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "purchase_order"("id", "locationId", "paymentType", "name", "orderDate", "expectedReceiveDate", "receiveDate", "status", "expectedTotalCost", "receivedTotalCost", "comment", "supplierId") SELECT "id", "locationId", "paymentMethod", "name", "orderDate", "expectedReceiveDate", "receiveDate", "status", "expectedTotalCost", "receivedTotalCost", "comment", "supplierId" FROM "temporary_purchase_order"`);
        await queryRunner.query(`DROP TABLE "temporary_purchase_order"`);
    }

}
