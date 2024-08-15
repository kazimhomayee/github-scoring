import { Injectable, Logger } from '@nestjs/common';
import { SearchRepositoriesDto } from './dto/search-repositories.dto';
import { HttpClientService } from '../http-client/http-client.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { ScoringService } from '../scoring/scoring.service';
import { GithubResponse } from './github-response';
@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(
    private httpClient: HttpClientService,
    private scoringService: ScoringService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async searchRepositories(
    SearchRepositoriesDto: SearchRepositoriesDto,
  ): Promise<GithubResponse> {
    try {
      const response: GithubResponse = await this.httpClient.get({
        q: this.queryBuilder(SearchRepositoriesDto),
        sort: SearchRepositoriesDto.sort,
        order: SearchRepositoriesDto.order,
        per_page: SearchRepositoriesDto.per_page,
        page: SearchRepositoriesDto.page,
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

  async scoreRepositories(
    query?: string,
    per_page?: number,
    page?: number,
  ): Promise<GithubResponse> {
    try {
      const { language, createdBefore } = await this.checkConfiguration();
      const searchRepositoryDto: SearchRepositoriesDto = {
        language,
        createdBefore,
        query: query || '',
        per_page: per_page || 10,
        page: page || 1,
      };
      const response = await this.searchRepositories(searchRepositoryDto);
      return await this.transformedResponse(response);
    } catch (error) {
      throw new Error(`Error while scoring repositories: ${error.message}`);
    }
  }

  async transformedResponse(response): Promise<GithubResponse> {
    const transformedItems = await Promise.all(
      response.items.map(async (item) => {
        const score = await this.scoringService.calculateRepositoryScore(
          item.stargazers_count,
          item.forks,
          item.updated_at,
        );

        return {
          id: item.id,
          name: item.name,
          full_name: item.full_name,
          private: item.private,
          stars: item.stargazers_count,
          forks: item.forks,
          updated_at: item.updated_at,
          score,
        };
      }),
    );

    return {
      ...response,
      items: transformedItems,
    };
  }

  async checkConfiguration() {
    const language = await this.redis.get('language');
    const createdBefore = await this.redis.get('createdBefore');
    const maxStars = await this.redis.get('maxStars');
    const maxForks = await this.redis.get('maxForks');

    if (!language || !createdBefore || !maxStars || !maxForks) {
      throw new Error(
        `Missing configuration. Please set language and earliest configuration at '/github/config/{language}/{YYYY-MM-DD}`,
      );
    }

    return {
      language,
      createdBefore,
      maxStars,
      maxForks,
    };
  }

  async setConfiguration(language: string, createdBefore: string) {
    const { maxStars, maxForks } = await this.getMaxStartsAndForks(
      language,
      createdBefore,
    );
    await this.redis.set('language', language);
    await this.redis.set('createdBefore', createdBefore);
    await this.redis.set('maxStars', maxStars);
    await this.redis.set('maxForks', maxForks);

    return await this.checkConfiguration();
  }

  async getMaxStartsAndForks(language, createdBefore) {
    const maxStars = await this.fetchMaxStars(language, createdBefore);
    const maxForks = await this.fetchMaxForks(language, createdBefore);

    return { maxStars, maxForks };
  }

  private async fetchMaxStars(language, createdBefore): Promise<number> {
    const response = await this.searchRepositories({
      language,
      createdBefore,
      sort: 'stars',
      order: 'desc',
      per_page: 1,
    });
    const maxStars = response.items[0].stargazers_count;
    this.logger.debug(`Max stargazers_count: ${maxStars}`);
    return maxStars;
  }

  private async fetchMaxForks(language, createdBefore): Promise<number> {
    const response = await this.searchRepositories({
      language,
      createdBefore,
      sort: 'forks',
      order: 'desc',
      per_page: 1,
    });
    const maxForks = response.items[0].forks_count;
    this.logger.debug(`Max forks_count: ${maxForks}`);
    return maxForks;
  }
}
