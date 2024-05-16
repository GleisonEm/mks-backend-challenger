import { MoviesModule } from '@/movies/movies.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MoviesRedisManagerQueueConsumer } from './movies-redis-manager-queue-consumer/movies-redis-manager-queue-consumer';

@Module({
  imports: [
    MoviesModule,
    BullModule.registerQueue({
      name: 'moviesManagerRedis',
    }),
  ],
  providers: [MoviesRedisManagerQueueConsumer],
})
export class ConsumersModule {}
