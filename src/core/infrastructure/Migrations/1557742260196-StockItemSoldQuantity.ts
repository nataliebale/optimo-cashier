import {MigrationInterface, QueryRunner} from "typeorm";

export class StockItemSoldQuantity1557742260196 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_stock_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "photoUrl" varchar NOT NULL, "photoPath" varchar NOT NULL, "barcode" varchar NOT NULL, "name" varchar NOT NULL, "quantity" integer NOT NULL, "unitPrice" integer NOT NULL, "categoryId" integer, "soldQuantity" integer NOT NULL DEFAULT (0), CONSTRAINT "FK_94b766dbe41b9e5a96476edf62a" FOREIGN KEY ("categoryId") REFERENCES "stock_item_category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_stock_item"("id", "photoUrl", "photoPath", "barcode", "name", "quantity", "unitPrice", "categoryId") SELECT "id", "photoUrl", "photoPath", "barcode", "name", "quantity", "unitPrice", "categoryId" FROM "stock_item"`);
        await queryRunner.query(`DROP TABLE "stock_item"`);
        await queryRunner.query(`ALTER TABLE "temporary_stock_item" RENAME TO "stock_item"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "stock_item" RENAME TO "temporary_stock_item"`);
        await queryRunner.query(`CREATE TABLE "stock_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "photoUrl" varchar NOT NULL, "photoPath" varchar NOT NULL, "barcode" varchar NOT NULL, "name" varchar NOT NULL, "quantity" integer NOT NULL, "unitPrice" integer NOT NULL, "categoryId" integer, CONSTRAINT "FK_94b766dbe41b9e5a96476edf62a" FOREIGN KEY ("categoryId") REFERENCES "stock_item_category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "stock_item"("id", "photoUrl", "photoPath", "barcode", "name", "quantity", "unitPrice", "categoryId") SELECT "id", "photoUrl", "photoPath", "barcode", "name", "quantity", "unitPrice", "categoryId" FROM "temporary_stock_item"`);
        await queryRunner.query(`DROP TABLE "temporary_stock_item"`);
    }

}
