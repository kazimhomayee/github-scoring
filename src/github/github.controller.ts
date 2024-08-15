import { Controller, Get } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}
  @Get()
  async getGithubScoring(): Promise<any> {
    const searchRepositoriesDto = {
      language: 'TypeScript',
      createdBefore: '2024-01-01',
    };
    return await this.githubService.scoreRepositories();
  }
}
