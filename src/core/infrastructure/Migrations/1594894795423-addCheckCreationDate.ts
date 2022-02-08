import {MigrationInterface, QueryRunner} from "typeorm";

export class addCheckCreationDate1594894795423 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_check" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "operatorId" integer NOT NULL, "shiftId" integer NOT NULL, "tableId" integer, "guestCount" integer, "products" text NOT NULL, "legalEntityData" text, "basketTotalPrice" integer NOT NULL, "taxRate" integer NOT NULL DEFAULT (0), "taxAmount" integer NOT NULL DEFAULT (0), "totalPrice" integer NOT NULL, "creationDate" datetime)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_check"("id", "operatorId", "shiftId", "tableId", "guestCount", "products", "legalEntityData", "basketTotalPrice", "taxRate", "taxAmount", "totalPrice") SELECT "id", "operatorId", "shiftId", "tableId", "guestCount", "products", "legalEntityData", "basketTotalPrice", "taxRate", "taxAmount", "totalPrice" FROM "check"`, undefined);
        await queryRunner.query(`DROP TABLE "check"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_check" RENAME TO "check"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "check" RENAME TO "temporary_check"`, undefined);
        await queryRunner.query(`CREATE TABLE "check" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "operatorId" integer NOT NULL, "shiftId" integer NOT NULL, "tableId" integer, "guestCount" integer, "products" text NOT NULL, "legalEntityData" text, "basketTotalPrice" integer NOT NULL, "taxRate" integer NOT NULL DEFAULT (0), "taxAmount" integer NOT NULL DEFAULT (0), "totalPrice" integer NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "check"("id", "operatorId", "shiftId", "tableId", "guestCount", "products", "legalEntityData", "basketTotalPrice", "taxRate", "taxAmount", "totalPrice") SELECT "id", "operatorId", "shiftId", "tableId", "guestCount", "products", "legalEntityData", "basketTotalPrice", "taxRate", "taxAmount", "totalPrice" FROM "temporary_check"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_check"`, undefined);
    }

}
