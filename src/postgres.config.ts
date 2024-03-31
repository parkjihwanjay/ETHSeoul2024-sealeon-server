import { DataSourceOptions } from 'typeorm';
import { SeaLeonServiceEntity } from './entities/sealeon.service.entity';
import { SeaLeonSecretHashEntity } from './entities/sealeon.secret-hash.entity';

export const postgresDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'sealeon-server-db',
  password: 'sealeon-server-db',
  database: 'sealeon-server-db',
  entities: [SeaLeonServiceEntity, SeaLeonSecretHashEntity],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
};
