// config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfig {
  static createTypeOrmOptions(
    configService: ConfigService,
  ): TypeOrmModuleOptions {

    return {
      type: 'postgres',
      host: configService.get<string>('TYPEORM_HOST'),
      port: configService.get<number>('TYPEORM_PORT'),
      username: configService.get<string>('TYPEORM_USERNAME'),
      password: configService.get<string>('TYPEORM_PASSWORD'),
      database: configService.get<string>('TYPEORM_DATABASE'),
      synchronize: true,
      entities: [__dirname + '/**/*.{model,entity}.{ts,js}'],
      migrations: ['dist/migrations/**/*.js'],
      subscribers: ['dist/subscriber/**/*.js'],
      cli: {
        migrationsDir: configService.get<string>('TYPEORM_MIGRATIONS_DIR'),
        subscribersDir: configService.get<string>('TYPEORM_SUBSCRIBERS_DIR'),
      },
    } as TypeOrmModuleOptions;
  }
}
