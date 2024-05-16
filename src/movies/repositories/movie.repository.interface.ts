// movie.repository.interface.ts
import { MovieDto } from '../dto/movie.create.dto';
import { Movie } from '../interfaces/movie.interface';

export const MOVIES_REPOSITORY_TOKEN = 'movies-repository-token';

export interface MoviesRepository {
  findAll(): Promise<Movie[]>;
  findById(id: string): Promise<Movie>;
  create(movie: MovieDto): Promise<Movie>;
  deleteMovie(movie: Movie): void;
  updateMovie(id: string, movieUpdateDto: MovieDto): void;
}
