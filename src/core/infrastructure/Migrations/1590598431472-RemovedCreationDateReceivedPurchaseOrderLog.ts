import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedCreationDateReceivedPurchaseOrderLog1590598431472 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_received_purchase_order_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "receiveDate" datetime NOT NULL, "orderLines" text NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_received_purchase_order_log"("id", "receiveDate", "orderLines") SELECT "id", "receiveDate", "orderLines" FROM "received_purchase_order_log"`, undefined);
        await queryRunner.query(`DROP TABLE "received_purchase_order_log"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_received_purchase_order_log" RENAME TO "received_purchase_order_log"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "received_purchase_order_log" RENAME TO "temporary_received_purchase_order_log"`, undefined);
        await queryRunner.query(`CREATE TABLE "received_purchase_order_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createDate" datetime NOT NULL, "receiveDate" datetime NOT NULL, "orderLines" text NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "received_purchase_order_log"("id", "receiveDate", "orderLines") SELECT "id", "receiveDate", "orderLines" FROM "temporary_received_purchase_order_log"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_received_purchase_order_log"`, undefined);
    }

}
