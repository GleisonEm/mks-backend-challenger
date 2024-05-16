// movie.service.ts
import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Movie } from './interfaces/movie.interface';
import { MovieDto } from './dto/movie.create.dto';
import { MOVIES_REPOSITORY_TOKEN } from './repositories/movie.repository.interface';
import { MoviesTypeOrmRepository } from './repositories/implementations/movie.typeorm.repository';
import { QueryFailedError, UpdateResult } from 'typeorm';
import { CACHE_MANAGER, Cache, CacheKey } from '@nestjs/cache-manager';
import { KEY_CACHE_GET_MOVIES } from './movies.cache.contants';
import { DuplicateTitleException } from '@/exceptions/duplicate-title.exception';

@Injectable()
export class MoviesService {
  constructor(
    @Inject(MOVIES_REPOSITORY_TOKEN)
    private readonly moviesRepository: MoviesTypeOrmRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async findAll(): Promise<Movie[]> {
    return await this.moviesRepository.findAll();
  }

  public async create(movie: MovieDto): Promise<Movie> {
    try {
      await this.cacheManager.del('get-movies');
      return await this.moviesRepository.create(movie);
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.code === '23505') {
        throw new DuplicateTitleException(movie.title);
      }
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async findById(movieId: string): Promise<Movie> {
    const user = await this.moviesRepository.findById(movieId);

    if (!user) {
      throw new NotFoundException(`Movie #${movieId} not found`);
    }

    return user;
  }

  public async updateMovie(
    id: string,
    movieUpdateDto: MovieDto,
  ): Promise<UpdateResult> {
    try {
      return await this.moviesRepository.updateMovie(id, movieUpdateDto);
    } catch (err) {
      throw new BadRequestException('Movie not updated');
    }
  }

  public async deleteMovie(id: string): Promise<void> {
    const user = await this.findById(id);

    return await this.moviesRepository.deleteMovie(user);
  }

  public async clearCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  public async setGetMoviesCache(): Promise<void> {
    const value = await this.findAll();
    await this.cacheManager.set(KEY_CACHE_GET_MOVIES, value, 3600);
  }
}
