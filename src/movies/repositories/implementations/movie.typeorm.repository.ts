// movie.typeorm.repository.ts
import { Movies } from '@/movies/models/movie.model';
import { Movie } from '../../interfaces/movie.interface';
import { MoviesRepository } from '../movie.repository.interface';
import { Repository, UpdateResult } from 'typeorm';
import { MovieDto } from '@/movies/dto/movie.create.dto';

export class MoviesTypeOrmRepository implements MoviesRepository {
  constructor(private readonly moviesRepository: Repository<Movies>) {}

  findAll(): Promise<Movie[]> {
    return this.moviesRepository.find();
  }

  create(movieDto: MovieDto): Promise<Movie> {
    const movie = new Movies();
    movie.title = movieDto.title;
    movie.description = movieDto.description;
    movie.director = movieDto.director;
    movie.releaseDate = movieDto.releaseDate;

    return this.moviesRepository.save(movie);
  }

  public async deleteMovie(movie: any): Promise<void> {
    await this.moviesRepository.remove(movie);
  }

  public async findById(movieId: string): Promise<Movie | null> {
    return await this.moviesRepository.findOneBy({
      id: +movieId,
    });
  }

  public async updateMovie(
    id: string,
    movieUpdateDto: MovieDto,
  ): Promise<UpdateResult> {
    return await this.moviesRepository.update(
      {
        id: +id,
      },
      { ...movieUpdateDto },
    );
  }
}
