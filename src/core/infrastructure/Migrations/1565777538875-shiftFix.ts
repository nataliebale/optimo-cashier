import {MigrationInterface, QueryRunner} from "typeorm";

export class shiftFix1565777538875 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "operatorId" integer NOT NULL, "cashBegin" integer NOT NULL, "cashEnd" integer, "dateBegin" datetime NOT NULL, "dateEnd" datetime, "finished" boolean NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_shift"("id", "operatorId", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished") SELECT "id", "operatorId", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished" FROM "shift"`);
        await queryRunner.query(`DROP TABLE "shift"`);
        await queryRunner.query(`ALTER TABLE "temporary_shift" RENAME TO "shift"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "shift" RENAME TO "temporary_shift"`);
        await queryRunner.query(`CREATE TABLE "shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "operatorId" integer NOT NULL, "cashBegin" integer NOT NULL, "cashEnd" integer NOT NULL, "dateBegin" datetime NOT NULL, "dateEnd" datetime NOT NULL, "finished" boolean NOT NULL)`);
        await queryRunner.query(`INSERT INTO "shift"("id", "operatorId", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished") SELECT "id", "operatorId", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished" FROM "temporary_shift"`);
        await queryRunner.query(`DROP TABLE "temporary_shift"`);
    }

}
