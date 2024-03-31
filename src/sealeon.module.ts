import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SeaLeonController } from './sealeon.controller';
import { SeaLeonService } from './sealeon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresDataSourceOptions } from './postgres.config';
import { SeaLeonServiceEntity } from './entities/sealeon.service.entity';
import { NearService } from './near.service';
import { SeaLeonSecretHashEntity } from './entities/sealeon.secret-hash.entity';
import { ProxyMiddleware } from './proxy.middleware';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forRoot(postgresDataSourceOptions),
    TypeOrmModule.forFeature([SeaLeonServiceEntity, SeaLeonSecretHashEntity]),
    CacheModule.register(),
  ],
  controllers: [SeaLeonController],
  providers: [SeaLeonService, NearService],
})
export class SeaLeonModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(ProxyMiddleware).forRoutes('*');
  // }
}
