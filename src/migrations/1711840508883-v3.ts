import { MigrationInterface, QueryRunner } from "typeorm";

export class V31711840508883 implements MigrationInterface {
    name = 'V31711840508883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sea_leon_secret_hash_entity" RENAME COLUMN "endDate" TO "endTimeStamp"`);
        await queryRunner.query(`ALTER TABLE "sea_leon_secret_hash_entity" DROP COLUMN "endTimeStamp"`);
        await queryRunner.query(`ALTER TABLE "sea_leon_secret_hash_entity" ADD "endTimeStamp" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sea_leon_secret_hash_entity" DROP COLUMN "endTimeStamp"`);
        await queryRunner.query(`ALTER TABLE "sea_leon_secret_hash_entity" ADD "endTimeStamp" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sea_leon_secret_hash_entity" RENAME COLUMN "endTimeStamp" TO "endDate"`);
    }

}
