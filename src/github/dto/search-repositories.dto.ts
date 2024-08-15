import {
  IsString,
  IsOptional,
  IsDate,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class SearchRepositoriesDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  sort?: 'updated' | 'stars' | 'forks' | 'help-wanted-issues';

  @IsOptional()
  @IsNumber()
  per_page?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';

  @IsString()
  language: string;

  @IsDateString()
  createdBefore: string;
}
