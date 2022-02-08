import { MigrationInterface, QueryRunner } from 'typeorm';

export class MovedOperatorPermissions1584955685437 implements MigrationInterface {
  name = 'MovedOperatorPermissions1584955685437';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "old_operator" AS SELECT id, canReceivePurchaseOrders,canSetDiscount,canChangePrice, canDeleteBasket, canDeleteFromBasket FROM "operator"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_operator" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "pinCode" varchar NOT NULL, "status" integer NOT NULL)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_operator"("id", "name", "pinCode", "status") SELECT "id", "name", "pinCode", "status" FROM "operator"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "operator"`, undefined);
    await queryRunner.query(`ALTER TABLE "temporary_operator" RENAME TO "operator"`, undefined);
    await queryRunner.query(
      `CREATE TABLE "temporary_operator" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "pinCode" varchar NOT NULL, "status" integer NOT NULL, "permissions" text NOT NULL DEFAULT ('{}'))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_operator"("id", "name", "pinCode", "status") SELECT "id", "name", "pinCode", "status" FROM "operator"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "operator"`, undefined);
    await queryRunner.query(`ALTER TABLE "temporary_operator" RENAME TO "operator"`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "operator" RENAME TO "temporary_operator"`, undefined);
    await queryRunner.query(
      `CREATE TABLE "operator" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "pinCode" varchar NOT NULL, "status" integer NOT NULL)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "operator"("id", "name", "pinCode", "status") SELECT "id", "name", "pinCode", "status" FROM "temporary_operator"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_operator"`, undefined);
    await queryRunner.query(`ALTER TABLE "operator" RENAME TO "temporary_operator"`, undefined);
    await queryRunner.query(
      `CREATE TABLE "operator" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "pinCode" varchar NOT NULL, "status" integer NOT NULL, "canReceivePurchaseOrders" boolean DEFAULT (1), "canSetDiscount" boolean NOT NULL DEFAULT (1), "canChangePrice" boolean NOT NULL DEFAULT (1), "canDeleteFromBasket" boolean NOT NULL DEFAULT (1), "canDeleteBasket" boolean NOT NULL DEFAULT (1))`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "operator"("id", "name", "pinCode", "status") SELECT "id", "name", "pinCode", "status" FROM "temporary_operator"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_operator"`, undefined);
  }
}
