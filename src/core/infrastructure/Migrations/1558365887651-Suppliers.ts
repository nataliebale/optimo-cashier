import {MigrationInterface, QueryRunner} from "typeorm";

export class Suppliers1558365887651 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "supplier" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "status" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "supplier_stock_items_stock_item" ("supplierId" integer NOT NULL, "stockItemId" integer NOT NULL, PRIMARY KEY ("supplierId", "stockItemId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_959eb9842cb1c72415f57c91d6" ON "supplier_stock_items_stock_item" ("supplierId") `);
        await queryRunner.query(`CREATE INDEX "IDX_59353a4c3cff1475398539b077" ON "supplier_stock_items_stock_item" ("stockItemId") `);
        await queryRunner.query(`DROP INDEX "IDX_959eb9842cb1c72415f57c91d6"`);
        await queryRunner.query(`DROP INDEX "IDX_59353a4c3cff1475398539b077"`);
        await queryRunner.query(`CREATE TABLE "temporary_supplier_stock_items_stock_item" ("supplierId" integer NOT NULL, "stockItemId" integer NOT NULL, CONSTRAINT "FK_959eb9842cb1c72415f57c91d6e" FOREIGN KEY ("supplierId") REFERENCES "supplier" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_59353a4c3cff1475398539b0775" FOREIGN KEY ("stockItemId") REFERENCES "stock_item" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("supplierId", "stockItemId"))`);
        await queryRunner.query(`INSERT INTO "temporary_supplier_stock_items_stock_item"("supplierId", "stockItemId") SELECT "supplierId", "stockItemId" FROM "supplier_stock_items_stock_item"`);
        await queryRunner.query(`DROP TABLE "supplier_stock_items_stock_item"`);
        await queryRunner.query(`ALTER TABLE "temporary_supplier_stock_items_stock_item" RENAME TO "supplier_stock_items_stock_item"`);
        await queryRunner.query(`CREATE INDEX "IDX_959eb9842cb1c72415f57c91d6" ON "supplier_stock_items_stock_item" ("supplierId") `);
        await queryRunner.query(`CREATE INDEX "IDX_59353a4c3cff1475398539b077" ON "supplier_stock_items_stock_item" ("stockItemId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_59353a4c3cff1475398539b077"`);
        await queryRunner.query(`DROP INDEX "IDX_959eb9842cb1c72415f57c91d6"`);
        await queryRunner.query(`ALTER TABLE "supplier_stock_items_stock_item" RENAME TO "temporary_supplier_stock_items_stock_item"`);
        await queryRunner.query(`CREATE TABLE "supplier_stock_items_stock_item" ("supplierId" integer NOT NULL, "stockItemId" integer NOT NULL, PRIMARY KEY ("supplierId", "stockItemId"))`);
        await queryRunner.query(`INSERT INTO "supplier_stock_items_stock_item"("supplierId", "stockItemId") SELECT "supplierId", "stockItemId" FROM "temporary_supplier_stock_items_stock_item"`);
        await queryRunner.query(`DROP TABLE "temporary_supplier_stock_items_stock_item"`);
        await queryRunner.query(`CREATE INDEX "IDX_59353a4c3cff1475398539b077" ON "supplier_stock_items_stock_item" ("stockItemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_959eb9842cb1c72415f57c91d6" ON "supplier_stock_items_stock_item" ("supplierId") `);
        await queryRunner.query(`DROP INDEX "IDX_59353a4c3cff1475398539b077"`);
        await queryRunner.query(`DROP INDEX "IDX_959eb9842cb1c72415f57c91d6"`);
        await queryRunner.query(`DROP TABLE "supplier_stock_items_stock_item"`);
        await queryRunner.query(`DROP TABLE "supplier"`);
    }

}
