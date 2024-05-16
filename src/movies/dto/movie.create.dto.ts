import { MaxLength, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class MovieDto {
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @MaxLength(600)
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  readonly director: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  readonly releaseDate: string;
}
