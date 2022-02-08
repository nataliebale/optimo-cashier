import {MigrationInterface, QueryRunner} from "typeorm";

export class addedEntitySaleNewFields1574844954733 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_entity_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar NOT NULL DEFAULT (''), "driverPIN" varchar NOT NULL DEFAULT (''), "driverName" varchar NOT NULL DEFAULT (''), "driverCarNumber" varchar NOT NULL DEFAULT (''), "driverIsForeignСitizen" boolean NOT NULL DEFAULT (0), "comment" varchar NOT NULL DEFAULT (''))`);
        await queryRunner.query(`INSERT INTO "temporary_entity_transaction"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines" FROM "entity_transaction"`);
        await queryRunner.query(`DROP TABLE "entity_transaction"`);
        await queryRunner.query(`ALTER TABLE "temporary_entity_transaction" RENAME TO "entity_transaction"`);
        await queryRunner.query(`CREATE TABLE "temporary_entity_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "createDate" datetime NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL, "hasTransportation" boolean NOT NULL DEFAULT (0), "startAddress" varchar NOT NULL DEFAULT (''), "endAddress" varchar NOT NULL DEFAULT (''), "driverPIN" varchar NOT NULL DEFAULT (''), "driverName" varchar NOT NULL DEFAULT (''), "driverCarNumber" varchar NOT NULL DEFAULT (''), "driverIsForeignСitizen" boolean NOT NULL DEFAULT (0), "comment" varchar NOT NULL DEFAULT (''))`);
        await queryRunner.query(`INSERT INTO "temporary_entity_transaction_log"("id", "entityIdentifier", "entityName", "entityType", "createDate", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines") SELECT "id", "entityIdentifier", "entityName", "entityType", "createDate", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines" FROM "entity_transaction_log"`);
        await queryRunner.query(`DROP TABLE "entity_transaction_log"`);
        await queryRunner.query(`ALTER TABLE "temporary_entity_transaction_log" RENAME TO "entity_transaction_log"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "entity_transaction_log" RENAME TO "temporary_entity_transaction_log"`);
        await queryRunner.query(`CREATE TABLE "entity_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "createDate" datetime NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL)`);
        await queryRunner.query(`INSERT INTO "entity_transaction_log"("id", "entityIdentifier", "entityName", "entityType", "createDate", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines") SELECT "id", "entityIdentifier", "entityName", "entityType", "createDate", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines" FROM "temporary_entity_transaction_log"`);
        await queryRunner.query(`DROP TABLE "temporary_entity_transaction_log"`);
        await queryRunner.query(`ALTER TABLE "entity_transaction" RENAME TO "temporary_entity_transaction"`);
        await queryRunner.query(`CREATE TABLE "entity_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL)`);
        await queryRunner.query(`INSERT INTO "entity_transaction"("id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines") SELECT "id", "entityIdentifier", "entityName", "entityType", "orderDate", "operatorId", "paymentMethod", "transactionId", "transactionDescription", "orderLines" FROM "temporary_entity_transaction"`);
        await queryRunner.query(`DROP TABLE "temporary_entity_transaction"`);
    }

}
