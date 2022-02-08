import {MigrationInterface, QueryRunner} from "typeorm";

export class operatorPermissions1570714164525 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_operator" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "pinCode" varchar NOT NULL, "status" integer NOT NULL, "canReceivePurchaseOrders" boolean, "canSetDiscount" boolean NOT NULL DEFAULT (1), "canChangePrice" boolean NOT NULL DEFAULT (1), "canDeleteFromBasket" boolean NOT NULL DEFAULT (1))`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_operator"("id", "name", "pinCode", "status", "canReceivePurchaseOrders") SELECT "id", "name", "pinCode", "status", "canReceivePurchaseOrders" FROM "operator"`, undefined);
        await queryRunner.query(`DROP TABLE "operator"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_operator" RENAME TO "operator"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_operator" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "pinCode" varchar NOT NULL, "status" integer NOT NULL, "canReceivePurchaseOrders" boolean DEFAULT (1), "canSetDiscount" boolean NOT NULL DEFAULT (1), "canChangePrice" boolean NOT NULL DEFAULT (1), "canDeleteFromBasket" boolean NOT NULL DEFAULT (1))`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_operator"("id", "name", "pinCode", "status", "canReceivePurchaseOrders", "canSetDiscount", "canChangePrice", "canDeleteFromBasket") SELECT "id", "name", "pinCode", "status", "canReceivePurchaseOrders", "canSetDiscount", "canChangePrice", "canDeleteFromBasket" FROM "operator"`, undefined);
        await queryRunner.query(`DROP TABLE "operator"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_operator" RENAME TO "operator"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "operator" RENAME TO "temporary_operator"`, undefined);
        await queryRunner.query(`CREATE TABLE "operator" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "pinCode" varchar NOT NULL, "status" integer NOT NULL, "canReceivePurchaseOrders" boolean, "canSetDiscount" boolean NOT NULL DEFAULT (1), "canChangePrice" boolean NOT NULL DEFAULT (1), "canDeleteFromBasket" boolean NOT NULL DEFAULT (1))`, undefined);
        await queryRunner.query(`INSERT INTO "operator"("id", "name", "pinCode", "status", "canReceivePurchaseOrders", "canSetDiscount", "canChangePrice", "canDeleteFromBasket") SELECT "id", "name", "pinCode", "status", "canReceivePurchaseOrders", "canSetDiscount", "canChangePrice", "canDeleteFromBasket" FROM "temporary_operator"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_operator"`, undefined);
        await queryRunner.query(`ALTER TABLE "operator" RENAME TO "temporary_operator"`, undefined);
        await queryRunner.query(`CREATE TABLE "operator" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "pinCode" varchar NOT NULL, "status" integer NOT NULL, "canReceivePurchaseOrders" boolean)`, undefined);
        await queryRunner.query(`INSERT INTO "operator"("id", "name", "pinCode", "status", "canReceivePurchaseOrders") SELECT "id", "name", "pinCode", "status", "canReceivePurchaseOrders" FROM "temporary_operator"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_operator"`, undefined);
    }

}
