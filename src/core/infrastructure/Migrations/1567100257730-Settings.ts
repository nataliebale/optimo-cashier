import {MigrationInterface, QueryRunner} from "typeorm";

export class Settings1567100257730 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "settings_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" text NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "settings_entity"`);
    }

}
