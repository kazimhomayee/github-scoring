import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Octokit } from '@octokit/core';
import { SearchRepositoriesDto } from './dto/search-repositories.dto';
import { HttpClientService } from '../http-client/http-client.service';
@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(private httpClient: HttpClientService) {}

  async searchRepositories(SearchRepositoriesDto: SearchRepositoriesDto) {
    try {
      const response = await this.httpClient.get({
        q: this.queryBuilder(SearchRepositoriesDto),
        sort: SearchRepositoriesDto.sort,
        order: SearchRepositoriesDto.order,
      });
      return response;
    } catch (error) {
      throw new Error(`GitHub API request failed: ${error.message}`);
    }
  }

  queryBuilder(SearchRepositoriesDto: SearchRepositoriesDto) {
    let searchQuery = SearchRepositoriesDto.query
      ? `${SearchRepositoriesDto.query}+`
      : ``;
    searchQuery += `language:${SearchRepositoriesDto.language}+created:<=${SearchRepositoriesDto.createdBefore}`;

    return searchQuery;
  }
}
