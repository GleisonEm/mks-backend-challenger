import { Test, TestingModule } from '@nestjs/testing';
import { MoviesRedisManagerWorkerService } from './movies-redis-manager-worker.service';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';

describe('MoviesRedisManagerWorkerService', () => {
  let service: MoviesRedisManagerWorkerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesRedisManagerWorkerService,
        {
          provide: getQueueToken('moviesManagerRedis'),
          useValue: {
            add: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesRedisManagerWorkerService>(
      MoviesRedisManagerWorkerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
