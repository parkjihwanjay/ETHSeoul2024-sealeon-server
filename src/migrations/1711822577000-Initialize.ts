import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initialize1711822577000 implements MigrationInterface {
  name = 'Initialize1711822577000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sea_leon_service_entity" ("entityId" SERIAL NOT NULL, "uuid" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "providerAddress" character varying NOT NULL, "serviceLink" character varying NOT NULL, "serviceName" character varying NOT NULL, "serviceDescription" character varying NOT NULL, "tags" text NOT NULL, "thumbnail" bytea NOT NULL, "screenshot" bytea NOT NULL, "serviceSubtitle" character varying NOT NULL, "serviceLongDescription" text NOT NULL, "secretHash" character varying, CONSTRAINT "PK_c63e54d8447dc4da7e0833c3d79" PRIMARY KEY ("entityId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sea_leon_service_entity"`);
  }
}
