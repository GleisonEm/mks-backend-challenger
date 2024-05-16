import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { IamModule } from './iam/iam.module';
import { MoviesModule } from './movies/movies.module';
import * as Yup from 'yup';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { RedisOptions } from './configs/app-options.constants';
import { WorkerModule } from './worker/worker.module';
import { ConsumersModule } from './consumers/consumers.module';
import { DatabaseConfig } from './db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev', '.env.stage', '.env.prod'],
      validationSchema: Yup.object({
        TYPEORM_HOST: Yup.string().required(),
        TYPEORM_PORT: Yup.number().default(5432),
        TYPEORM_USERNAME: Yup.string().required(),
        TYPEORM_PASSWORD: Yup.string().required(),
        TYPEORM_DATABASE: Yup.string().required(),
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL'),
          limit: config.get<number>('THROTTLE_LIMIT'),
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        DatabaseConfig.createTypeOrmOptions(config),
    }),
    CacheModule.registerAsync<RedisClientOptions>(RedisOptions),
    IamModule,
    UsersModule,
    MoviesModule,
    WorkerModule,
    ConsumersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
