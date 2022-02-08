import {MigrationInterface, QueryRunner} from "typeorm";

export class addedImei1572528935138 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "imei" ("id" integer PRIMARY KEY NOT NULL, "imei" varchar NOT NULL, "stockItemId" integer)`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_imei" ("id" integer PRIMARY KEY NOT NULL, "imei" varchar NOT NULL, "stockItemId" integer, CONSTRAINT "FK_4ccc9140dfa24690aba832177cc" FOREIGN KEY ("stockItemId") REFERENCES "stock_item" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_imei"("id", "imei", "stockItemId") SELECT "id", "imei", "stockItemId" FROM "imei"`, undefined);
        await queryRunner.query(`DROP TABLE "imei"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_imei" RENAME TO "imei"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "imei" RENAME TO "temporary_imei"`, undefined);
        await queryRunner.query(`CREATE TABLE "imei" ("id" integer PRIMARY KEY NOT NULL, "imei" varchar NOT NULL, "stockItemId" integer)`, undefined);
        await queryRunner.query(`INSERT INTO "imei"("id", "imei", "stockItemId") SELECT "id", "imei", "stockItemId" FROM "temporary_imei"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_imei"`, undefined);
        await queryRunner.query(`DROP TABLE "imei"`, undefined);
    }

}
