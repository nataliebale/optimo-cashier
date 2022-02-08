import {MigrationInterface, QueryRunner} from "typeorm";

export class entitytransaction1571146146119 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "entity_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL)`, undefined);
        await queryRunner.query(`CREATE TABLE "entity_transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar NOT NULL, "createDate" datetime NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "entity_transaction_log"`, undefined);
        await queryRunner.query(`DROP TABLE "entity_transaction"`, undefined);
    }

}
