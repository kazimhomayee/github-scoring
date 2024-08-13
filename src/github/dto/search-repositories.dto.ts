import { IsString, IsOptional, IsDate } from 'class-validator';

export class SearchRepositoriesDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  sort?: 'updated' | 'stars' | 'forks' | 'help-wanted-issues';

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc';

  @IsString()
  language: string;

  @IsDate()
  createdBefore: Date;
}
