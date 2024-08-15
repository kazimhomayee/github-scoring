import { Controller, Get, Param, Query } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubResponse } from './github-response';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('scoring')
  async getGithubScoring(
    @Query('query') query: string,
    @Query('per_page') per_page: number,
    @Query('page') page: number,
  ): Promise<GithubResponse> {
    try {
      return await this.githubService.scoreRepositories(query, per_page, page);
    } catch (error) {
      return error.message;
    }
  }

  @Get('config/:language/:createdBefore')
  async setConfiguration(
    @Param('language') language: string,
    @Param('createdBefore') createdBefore: string,
  ) {
    try {
      return await this.githubService.setConfiguration(language, createdBefore);
    } catch (error) {
      return error.message;
    }
  }
}
