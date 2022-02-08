import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedShiftEndOperatorId1596185711565 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "cashBegin" integer NOT NULL, "cashEnd" integer, "dateBegin" datetime NOT NULL, "dateEnd" datetime, "finished" boolean NOT NULL, "withdrawals" text, "startOperatorId" integer NOT NULL, "endOperatorId" integer)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_shift"("id", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished", "withdrawals", "startOperatorId") SELECT "id", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished", "withdrawals", "operatorId" FROM "shift" WHERE "finished" = false`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_shift"("id", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished", "withdrawals", "startOperatorId", "endOperatorId") SELECT "id", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished", "withdrawals", "operatorId", "operatorId" FROM "shift" WHERE "finished" = true`, undefined);
        await queryRunner.query(`DROP TABLE "shift"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_shift" RENAME TO "shift"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_shift_log" ("id" integer PRIMARY KEY NOT NULL, "cashBegin" integer NOT NULL, "cashEnd" integer, "dateBegin" datetime NOT NULL, "dateEnd" datetime, "finished" boolean NOT NULL, "withdrawals" text, "startOperatorId" integer NOT NULL, "endOperatorId" integer)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_shift_log"("id", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished", "withdrawals", "startOperatorId") SELECT "id", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished", "withdrawals", "operatorId" FROM "shift_log" WHERE "finished" = false`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_shift_log"("id", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished", "withdrawals", "startOperatorId", "endOperatorId") SELECT "id", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished", "withdrawals", "operatorId", "operatorId" FROM "shift_log" WHERE "finished" = true`, undefined);
        await queryRunner.query(`DROP TABLE "shift_log"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_shift_log" RENAME TO "shift_log"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "shift" RENAME TO "temporary_shift"`, undefined);
        await queryRunner.query(`CREATE TABLE "shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "operatorId" integer NOT NULL, "cashBegin" integer NOT NULL, "cashEnd" integer, "dateBegin" datetime NOT NULL, "dateEnd" datetime, "finished" boolean NOT NULL, "withdrawals" text)`, undefined);
        await queryRunner.query(`INSERT INTO "shift"("id", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished", "withdrawals", "operatorId") SELECT "id", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished", "withdrawals", "startOperatorId" FROM "temporary_shift"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_shift"`, undefined);
        await queryRunner.query(`ALTER TABLE "shift_log" RENAME TO "temporary_shift_log"`, undefined);
        await queryRunner.query(`CREATE TABLE "shift_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "operatorId" integer NOT NULL, "cashBegin" integer NOT NULL, "cashEnd" integer, "dateBegin" datetime NOT NULL, "dateEnd" datetime, "finished" boolean NOT NULL, "withdrawals" text)`, undefined);
        await queryRunner.query(`INSERT INTO "shift_log"("id", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished", "withdrawals", "operatorId") SELECT "id", "cashBegin", "cashEnd", "dateBegin", "dateEnd", "finished", "withdrawals", "startOperatorId" FROM "temporary_shift_log"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_shift_log"`, undefined);
    }

}
