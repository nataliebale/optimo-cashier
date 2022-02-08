import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedSessionIDToString1596018908768 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_operator_session" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "loginDate" datetime NOT NULL, "logoutDate" datetime, "operatorId" integer, CONSTRAINT "FK_0ff376c7489a50f059c6b6a7561" FOREIGN KEY ("operatorId") REFERENCES "operator" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_operator_session"("id", "loginDate", "logoutDate", "operatorId") SELECT "id", "loginDate", "logoutDate", "operatorId" FROM "operator_session"`, undefined);
        await queryRunner.query(`DROP TABLE "operator_session"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_operator_session" RENAME TO "operator_session"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_operator_session_action" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "actionType" integer NOT NULL, "sessionId" integer NOT NULL, "date" datetime NOT NULL, "operatorId" integer NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_operator_session_action"("id", "actionType", "sessionId", "date", "operatorId") SELECT "id", "actionType", "sessionId", "date", "operatorId" FROM "operator_session_action"`, undefined);
        await queryRunner.query(`DROP TABLE "operator_session_action"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_operator_session_action" RENAME TO "operator_session_action"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_operator_session_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "loginDate" datetime NOT NULL, "logoutDate" datetime NOT NULL, "operatorId" integer, CONSTRAINT "FK_a93b74cbfb00ce87fd60b65a1b8" FOREIGN KEY ("operatorId") REFERENCES "operator" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_operator_session_log"("id", "loginDate", "logoutDate", "operatorId") SELECT "id", "loginDate", "logoutDate", "operatorId" FROM "operator_session_log"`, undefined);
        await queryRunner.query(`DROP TABLE "operator_session_log"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_operator_session_log" RENAME TO "operator_session_log"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_operator_session" ("id" varchar PRIMARY KEY NOT NULL, "loginDate" datetime NOT NULL, "logoutDate" datetime, "operatorId" integer, CONSTRAINT "FK_0ff376c7489a50f059c6b6a7561" FOREIGN KEY ("operatorId") REFERENCES "operator" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_operator_session"("id", "loginDate", "logoutDate", "operatorId") SELECT "id", "loginDate", "logoutDate", "operatorId" FROM "operator_session"`, undefined);
        await queryRunner.query(`DROP TABLE "operator_session"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_operator_session" RENAME TO "operator_session"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_operator_session_action" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "actionType" integer NOT NULL, "sessionId" varchar NOT NULL, "date" datetime NOT NULL, "operatorId" integer NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_operator_session_action"("id", "actionType", "sessionId", "date", "operatorId") SELECT "id", "actionType", "sessionId", "date", "operatorId" FROM "operator_session_action"`, undefined);
        await queryRunner.query(`DROP TABLE "operator_session_action"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_operator_session_action" RENAME TO "operator_session_action"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_operator_session_log" ("id" varchar PRIMARY KEY NOT NULL, "loginDate" datetime NOT NULL, "logoutDate" datetime NOT NULL, "operatorId" integer, CONSTRAINT "FK_a93b74cbfb00ce87fd60b65a1b8" FOREIGN KEY ("operatorId") REFERENCES "operator" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_operator_session_log"("id", "loginDate", "logoutDate", "operatorId") SELECT "id", "loginDate", "logoutDate", "operatorId" FROM "operator_session_log"`, undefined);
        await queryRunner.query(`DROP TABLE "operator_session_log"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_operator_session_log" RENAME TO "operator_session_log"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "operator_session_log" RENAME TO "temporary_operator_session_log"`, undefined);
        await queryRunner.query(`CREATE TABLE "operator_session_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "loginDate" datetime NOT NULL, "logoutDate" datetime NOT NULL, "operatorId" integer, CONSTRAINT "FK_a93b74cbfb00ce87fd60b65a1b8" FOREIGN KEY ("operatorId") REFERENCES "operator" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "operator_session_log"("id", "loginDate", "logoutDate", "operatorId") SELECT "id", "loginDate", "logoutDate", "operatorId" FROM "temporary_operator_session_log"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_operator_session_log"`, undefined);
        await queryRunner.query(`ALTER TABLE "operator_session_action" RENAME TO "temporary_operator_session_action"`, undefined);
        await queryRunner.query(`CREATE TABLE "operator_session_action" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "actionType" integer NOT NULL, "sessionId" integer NOT NULL, "date" datetime NOT NULL, "operatorId" integer NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "operator_session_action"("id", "actionType", "sessionId", "date", "operatorId") SELECT "id", "actionType", "sessionId", "date", "operatorId" FROM "temporary_operator_session_action"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_operator_session_action"`, undefined);
        await queryRunner.query(`ALTER TABLE "operator_session" RENAME TO "temporary_operator_session"`, undefined);
        await queryRunner.query(`CREATE TABLE "operator_session" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "loginDate" datetime NOT NULL, "logoutDate" datetime, "operatorId" integer, CONSTRAINT "FK_0ff376c7489a50f059c6b6a7561" FOREIGN KEY ("operatorId") REFERENCES "operator" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "operator_session"("id", "loginDate", "logoutDate", "operatorId") SELECT "id", "loginDate", "logoutDate", "operatorId" FROM "temporary_operator_session"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_operator_session"`, undefined);
        await queryRunner.query(`ALTER TABLE "operator_session_log" RENAME TO "temporary_operator_session_log"`, undefined);
        await queryRunner.query(`CREATE TABLE "operator_session_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "loginDate" datetime NOT NULL, "logoutDate" datetime NOT NULL, "operatorId" integer, CONSTRAINT "FK_a93b74cbfb00ce87fd60b65a1b8" FOREIGN KEY ("operatorId") REFERENCES "operator" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "operator_session_log"("id", "loginDate", "logoutDate", "operatorId") SELECT "id", "loginDate", "logoutDate", "operatorId" FROM "temporary_operator_session_log"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_operator_session_log"`, undefined);
        await queryRunner.query(`ALTER TABLE "operator_session_action" RENAME TO "temporary_operator_session_action"`, undefined);
        await queryRunner.query(`CREATE TABLE "operator_session_action" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "actionType" integer NOT NULL, "sessionId" integer NOT NULL, "date" datetime NOT NULL, "operatorId" integer NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "operator_session_action"("id", "actionType", "sessionId", "date", "operatorId") SELECT "id", "actionType", "sessionId", "date", "operatorId" FROM "temporary_operator_session_action"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_operator_session_action"`, undefined);
        await queryRunner.query(`ALTER TABLE "operator_session" RENAME TO "temporary_operator_session"`, undefined);
        await queryRunner.query(`CREATE TABLE "operator_session" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "loginDate" datetime NOT NULL, "logoutDate" datetime, "operatorId" integer, CONSTRAINT "FK_0ff376c7489a50f059c6b6a7561" FOREIGN KEY ("operatorId") REFERENCES "operator" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "operator_session"("id", "loginDate", "logoutDate", "operatorId") SELECT "id", "loginDate", "logoutDate", "operatorId" FROM "temporary_operator_session"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_operator_session"`, undefined);
    }

}
