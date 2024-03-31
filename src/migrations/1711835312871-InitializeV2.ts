import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitializeV21711835312871 implements MigrationInterface {
  name = 'InitializeV21711835312871';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sea_leon_secret_hash_entity" ("entityId" SERIAL NOT NULL, "secretHash" character varying NOT NULL, "endDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_d2b3ba2a135bf1126938a940528" PRIMARY KEY ("entityId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sea_leon_secret_hash_entity"`);
  }
}
