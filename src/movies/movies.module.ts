import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movies } from './models/movie.model';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { provideMoviesRepository } from './repositories/movies.repository.provider';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { RedisOptions } from '@/configs/app-options.constants';
import { WorkerModule } from '@/worker/worker.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movies]),
    CacheModule.registerAsync(RedisOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WorkerModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService, ...provideMoviesRepository()],
  exports: [MoviesService],
})
export class MoviesModule {}
