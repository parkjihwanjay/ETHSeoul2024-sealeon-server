import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SeaLeonSecretHashEntity {
  @PrimaryGeneratedColumn()
  entityId: number;

  @Column({ type: 'varchar' })
  secretHash: string;

  @Column({ type: 'varchar' })
  endTimeStamp: string;
}
