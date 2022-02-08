import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedEntityClient1606301615493 implements MigrationInterface {
    name = 'AddedEntityClient1606301615493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "entity_client" ("id" integer PRIMARY KEY NOT NULL, "entityIdentifier" varchar NOT NULL, "entityName" varchar NOT NULL, "entityType" varchar, "description" varchar, "bankAccount" varchar, "contactPerson" varchar, "phoneNumber" varchar, "email" varchar, "isVATRegistered" boolean NOT NULL, "status" integer NOT NULL, "dashboardPriority" integer)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "entity_client"`);
    }

}
