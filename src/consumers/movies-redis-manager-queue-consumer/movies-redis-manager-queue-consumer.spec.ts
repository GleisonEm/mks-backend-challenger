import { MoviesRedisManagerQueueConsumer } from './movies-redis-manager-queue-consumer';
import { MoviesService } from '../../movies/movies.service'; // Substitua "../movies/movies.service" pelo caminho relativo real para movies.service

jest.mock('../../movies/movies.service'); // Substitua "../movies/movies.service" pelo caminho relativo real para movies.service

describe('MoviesRedisManagerQueueConsumer', () => {
  let service: MoviesService;

  beforeEach(() => {
    service = new MoviesService(null, null); // Substitua null pelos argumentos reais necessários para instanciar MoviesService se houver algum
  });

  it('should be defined', () => {
    expect(new MoviesRedisManagerQueueConsumer(service)).toBeDefined();
  });
});
