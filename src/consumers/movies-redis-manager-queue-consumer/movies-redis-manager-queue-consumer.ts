import {
  KEY_CACHE_FIND_MOVIE_BY_ID,
  KEY_CACHE_GET_MOVIES,
} from '@/movies/movies.cache.contants';
import { MoviesService } from '@/movies/movies.service';
import { Process, Processor } from '@nestjs/bull';

@Processor('moviesManagerRedis')
export class MoviesRedisManagerQueueConsumer {
  constructor(private readonly moviesService: MoviesService) {}

  @Process('updateCache')
  async updateCache(): Promise<void> {
    console.log('job received: updateCache');

    [KEY_CACHE_GET_MOVIES, KEY_CACHE_FIND_MOVIE_BY_ID].forEach(
      async (keyConstant: string) => {
        await this.moviesService.clearCache(keyConstant);
      },
    );

    await this.moviesService.setGetMoviesCache();
  }
}
