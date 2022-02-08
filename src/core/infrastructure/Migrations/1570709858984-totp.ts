import {MigrationInterface, QueryRunner} from "typeorm";

export class totp1570709858984 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "totp" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "totp" varchar NOT NULL, "useDate" datetime NOT NULL)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "totp"`, undefined);
    }

}
