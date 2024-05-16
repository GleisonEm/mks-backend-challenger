import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from '../../constants';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { MOVIES_REPOSITORY_TOKEN } from './movie.repository.interface';
import { MoviesTypeOrmRepository } from './implementations/movie.typeorm.repository';
import { Movies } from '../models/movie.model';

config();

export const configService = new ConfigService();

export function provideMoviesRepository(): Provider[] {
  return [
    {
      provide: MOVIES_REPOSITORY_TOKEN,
      useFactory: async (
        dependenciesProvider: MoviesRepoDependenciesProvider,
      ) => provideMoviesRepositoryFactory(dependenciesProvider),
      inject: [MoviesRepoDependenciesProvider],
    },
    MoviesRepoDependenciesProvider,
  ];
}

async function provideMoviesRepositoryFactory(
  dependenciesProvider: MoviesRepoDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;

  switch (configService.get('MOVIES_DATASOURCE')) {
    case DataSource.TYPEORM:
      return new MoviesTypeOrmRepository(
        dependenciesProvider.typeOrmRepository,
      );
  }
}

@Injectable()
export class MoviesRepoDependenciesProvider {
  constructor(
    @InjectRepository(Movies)
    public typeOrmRepository: Repository<Movies>,
  ) {}
}
