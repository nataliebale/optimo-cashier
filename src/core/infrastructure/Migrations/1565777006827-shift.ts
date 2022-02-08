import {MigrationInterface, QueryRunner} from "typeorm";

export class shift1565777006827 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "operatorId" integer NOT NULL, "cashBegin" integer NOT NULL, "cashEnd" integer NOT NULL, "dateBegin" datetime NOT NULL, "dateEnd" datetime NOT NULL, "finished" boolean NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "shift"`);
    }

}
