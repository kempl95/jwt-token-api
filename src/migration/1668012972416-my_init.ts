import { MigrationInterface, QueryRunner } from "typeorm";

export class myInit1668012972416 implements MigrationInterface {
    name = 'myInit1668012972416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(300) NOT NULL, "login" character varying(300) NOT NULL, "password" character varying(300) NOT NULL, "email" character varying(300), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
