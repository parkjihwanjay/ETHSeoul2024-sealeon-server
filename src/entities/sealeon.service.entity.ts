import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SeaLeonServiceEntity {
  @PrimaryGeneratedColumn()
  entityId: number;

  @Column({ type: 'uuid' })
  uuid: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar' })
  providerAddress: string;

  @Column({ type: 'varchar' })
  serviceLink: string;

  @Column({ type: 'varchar', nullable: true })
  resourceLink: string;

  @Column({ type: 'varchar' })
  serviceName: string;

  @Column({ type: 'varchar' })
  serviceDescription: string;

  @Column({ type: 'simple-array' })
  tags: string[];

  @Column({ type: 'bytea' })
  thumbnail: Buffer;

  @Column({ type: 'bytea' })
  screenshot: Buffer;

  @Column({ type: 'varchar' })
  serviceSubtitle: string;

  @Column({ type: 'text' })
  serviceLongDescription: string;

  @Column({ type: 'varchar', nullable: true })
  secretHash: string;
}
