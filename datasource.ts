// For TypeORM Cli
import { postgresDataSourceOptions } from './src/postgres.config';
import { DataSource } from 'typeorm';

export default new DataSource(postgresDataSourceOptions);
