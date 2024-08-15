import { Injectable, Logger } from '@nestjs/common';
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

  async scoreRepositories() {
    const SearchRepositoriesDto: SearchRepositoriesDto = {
      language: 'TypeScript',
      createdBefore: '2024-01-01',
    };

    const result = await this.searchRepositories(SearchRepositoriesDto);
    return await this.transformedResponse(result);
  }

  async transformedResponse(response): Promise<GithubResponse> {
    return {
      ...response,
      items: response.items.map((item) => ({
        id: item.id,
        name: item.name,
        full_name: item.full_name,
        private: item.private,
        score: 1, // Adding score
      })),
    };
  }
}
