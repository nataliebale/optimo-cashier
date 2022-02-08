import {MigrationInterface, QueryRunner} from "typeorm";

export class addedMigrationLog1588674487553 implements MigrationInterface {
    name = 'addedMigrationLog1588674487553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "migration_log" ("name" varchar PRIMARY KEY NOT NULL)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "migration_log"`, undefined);
    }

}
