import {MigrationInterface, QueryRunner} from "typeorm";

export class addSpacesAndTables1588161701890 implements MigrationInterface {
    name = 'addSpacesAndTables1588161701890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "table" ("id" integer PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "status" integer NOT NULL, "tableStatus" integer, "numberOfGuests" integer, "spaceId" integer)`, undefined);
        await queryRunner.query(`CREATE TABLE "space" ("id" integer PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "status" integer NOT NULL)`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_table" ("id" integer PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "status" integer NOT NULL, "tableStatus" integer, "numberOfGuests" integer, "spaceId" integer, CONSTRAINT "FK_83c86167f8ee80974f35e546474" FOREIGN KEY ("spaceId") REFERENCES "space" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_table"("id", "name", "status", "tableStatus", "numberOfGuests", "spaceId") SELECT "id", "name", "status", "tableStatus", "numberOfGuests", "spaceId" FROM "table"`, undefined);
        await queryRunner.query(`DROP TABLE "table"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_table" RENAME TO "table"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "table" RENAME TO "temporary_table"`, undefined);
        await queryRunner.query(`CREATE TABLE "table" ("id" integer PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "status" integer NOT NULL, "tableStatus" integer, "numberOfGuests" integer, "spaceId" integer)`, undefined);
        await queryRunner.query(`INSERT INTO "table"("id", "name", "status", "tableStatus", "numberOfGuests", "spaceId") SELECT "id", "name", "status", "tableStatus", "numberOfGuests", "spaceId" FROM "temporary_table"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_table"`, undefined);
        await queryRunner.query(`DROP TABLE "space"`, undefined);
        await queryRunner.query(`DROP TABLE "table"`, undefined);
    }

}
