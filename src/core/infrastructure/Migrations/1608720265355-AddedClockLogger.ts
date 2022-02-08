import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedClockLogger1608720265355 implements MigrationInterface {
    name = 'AddedClockLogger1608720265355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clock_drift_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "localTime" datetime NOT NULL, "realTime" datetime NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "clock_drift_warning_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "timeShown" datetime NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "clock_drift_warning_log"`);
        await queryRunner.query(`DROP TABLE "clock_drift_log"`);
    }

}
