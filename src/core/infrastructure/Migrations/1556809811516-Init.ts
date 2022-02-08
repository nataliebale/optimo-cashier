import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1556809811516 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "operator" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "pinCode" varchar NOT NULL, "status" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "stock_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "photoUrl" varchar NOT NULL, "photoPath" varchar NOT NULL, "barcode" varchar NOT NULL, "name" varchar NOT NULL, "quantity" integer NOT NULL, "unitPrice" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionawe" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "transaction_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "orderDate" datetime NOT NULL, "operatorId" integer, "paymentMethod" integer NOT NULL, "transactionId" varchar NOT NULL, "transactionDescription" varchar, "orderLines" text NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "transaction_log"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "stock_item"`);
        await queryRunner.query(`DROP TABLE "operator"`);
    }

}
