import {MigrationInterface, QueryRunner} from "typeorm";

export class shiftLog1565788726483 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "shift_log" ("id" integer PRIMARY KEY NOT NULL, "operatorId" integer NOT NULL, "cashBegin" integer NOT NULL, "cashEnd" integer, "dateBegin" datetime NOT NULL, "dateEnd" datetime, "finished" boolean NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "shift_log"`);
    }

}
