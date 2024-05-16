import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MoviesRedisManagerWorkerService {
  constructor(
    @InjectQueue('moviesManagerRedis') private moviesManagerRedisQueue: Queue,
  ) {}

  async addUpdateCacheToQueue(): Promise<void> {
    console.log('add to Queue');
    await this.moviesManagerRedisQueue.add('updateCache');

  }
}
