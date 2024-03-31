import { MigrationInterface, QueryRunner } from 'typeorm';

export class V31711852204751 implements MigrationInterface {
  name = 'V31711852204751';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sea_leon_service_entity" ADD "resourceLink" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sea_leon_service_entity" DROP COLUMN "resourceLink"`,
    );
  }
}
