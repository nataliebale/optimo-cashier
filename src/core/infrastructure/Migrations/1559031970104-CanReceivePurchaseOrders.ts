import {MigrationInterface, QueryRunner} from "typeorm";

export class CanReceivePurchaseOrders1559031970104 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_operator" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "pinCode" varchar NOT NULL, "status" integer NOT NULL, "canReceivePurchaseOrders" boolean)`);
        await queryRunner.query(`INSERT INTO "temporary_operator"("id", "name", "pinCode", "status") SELECT "id", "name", "pinCode", "status" FROM "operator"`);
        await queryRunner.query(`DROP TABLE "operator"`);
        await queryRunner.query(`ALTER TABLE "temporary_operator" RENAME TO "operator"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "operator" RENAME TO "temporary_operator"`);
        await queryRunner.query(`CREATE TABLE "operator" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "pinCode" varchar NOT NULL, "status" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "operator"("id", "name", "pinCode", "status") SELECT "id", "name", "pinCode", "status" FROM "temporary_operator"`);
        await queryRunner.query(`DROP TABLE "temporary_operator"`);
    }

}
