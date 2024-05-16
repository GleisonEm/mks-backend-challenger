import {
  Controller,
  Put,
  Get,
  Body,
  Param,
  HttpStatus,
  NotFoundException,
  Delete,
  BadRequestException,
  Post,
  UseInterceptors,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieDto } from './dto/movie.create.dto';
import { Movie } from './interfaces/movie.interface';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../iam/login/decorators/auth-guard.decorator';
import { AuthType } from '../iam/login/enums/auth-type.enum';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import {
  KEY_CACHE_FIND_MOVIE_BY_ID,
  KEY_CACHE_GET_MOVIES,
} from './movies.cache.contants';
import { MoviesRedisManagerWorkerService } from '@/worker/movies-redis-manager-worker/movies-redis-manager-worker.service';

@ApiTags('movies')
@AuthGuard(AuthType.Bearer)
@Controller('movies')
@UseInterceptors(CacheInterceptor)
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly moviesRedisManagerWorkerService: MoviesRedisManagerWorkerService,
  ) {}

  @CacheKey(KEY_CACHE_GET_MOVIES)
  @Get()
  public async getMovies(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Get('/all')
  public async all(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @CacheKey(KEY_CACHE_FIND_MOVIE_BY_ID)
  @Get('/:movieId')
  public async findMovieById(
    @Param('movieId') movieId: string,
  ): Promise<Movie> {
    const movie = await this.moviesService.findById(movieId);
    if (!movie) {
      throw new NotFoundException('Movie does not exist!');
    }
    return movie;
  }

  @Post()
  public async create(@Body() createMovieDto: MovieDto): Promise<any> {
    try {
      await this.moviesService.create(createMovieDto);

      await this.moviesRedisManagerWorkerService.addUpdateCacheToQueue();

      return {
        message: 'Movie registration successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: Movie not registration!');
    }
  }

  @Put('/:movieId')
  public async updateMovie(
    @Param('movieId') movieId: string,
    @Body() movieDto: MovieDto,
  ): Promise<any> {
    try {
      await this.moviesService.updateMovie(movieId, movieDto);

      this.moviesRedisManagerWorkerService.addUpdateCacheToQueue();

      return {
        message: 'Movie Updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: Movie not updated!');
    }
  }

  @Delete('/:movieId')
  public async deleteMovie(@Param('movieId') movieId: string): Promise<void> {
    await this.moviesService.deleteMovie(movieId);
    this.moviesRedisManagerWorkerService.addUpdateCacheToQueue();
  }
}
