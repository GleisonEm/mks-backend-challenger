import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MoviesRedisManagerWorkerService } from './movies-redis-manager-worker/movies-redis-manager-worker.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: +configService.get('REDIS_PORT'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'moviesManagerRedis',
    }),
  ],
  providers: [MoviesRedisManagerWorkerService],
  exports: [MoviesRedisManagerWorkerService],
})
export class WorkerModule {}
