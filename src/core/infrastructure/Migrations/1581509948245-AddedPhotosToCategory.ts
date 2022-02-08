import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedPhotosToCategory1581509948245 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_stock_item_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "status" integer, "parentCategoryId" integer, "photoUrl" varchar, "photoPath" varchar, CONSTRAINT "FK_291a3b8ddace77406fad3c404c5" FOREIGN KEY ("parentCategoryId") REFERENCES "stock_item_category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_stock_item_category"("id", "name", "description", "status", "parentCategoryId") SELECT "id", "name", "description", "status", "parentCategoryId" FROM "stock_item_category"`, undefined);
        await queryRunner.query(`DROP TABLE "stock_item_category"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_stock_item_category" RENAME TO "stock_item_category"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "stock_item_category" RENAME TO "temporary_stock_item_category"`, undefined);
        await queryRunner.query(`CREATE TABLE "stock_item_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "status" integer, "parentCategoryId" integer, CONSTRAINT "FK_291a3b8ddace77406fad3c404c5" FOREIGN KEY ("parentCategoryId") REFERENCES "stock_item_category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "stock_item_category"("id", "name", "description", "status", "parentCategoryId") SELECT "id", "name", "description", "status", "parentCategoryId" FROM "temporary_stock_item_category"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_stock_item_category"`, undefined);
    }

}
