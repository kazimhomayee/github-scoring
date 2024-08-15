import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class HttpClientService {
  private readonly githubToken: string =
    this.configService.get<string>('GITHUB_TOKEN');
  private readonly logger = new Logger(HttpClientService.name);
  private readonly GITHUB_API_URL =
    this.configService.get<string>('GITHUB_API_URL');

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    if (!this.GITHUB_API_URL) {
      throw new Error('GITHUB_API_URL is not defined');
    }

    if (!this.githubToken) {
      throw new Error(
        'Github token is missing. Please set it in the environment variables',
      );
    }
  }

  async get<T>(params?: any): Promise<T> {
    this.logger.debug('Get request to Github API');
    const headers = this.getHeaders();
    const SEARCH_URI = 'search/repositories';
    const URL = `${this.GITHUB_API_URL}${SEARCH_URI}?q=${params.q}&sort=${
      params.sort ? params.sort : ''
    }&order=${params.order ? params.order : ''}`;
    this.logger.debug(`Sending request to ${URL}`);
    try {
      const response: AxiosResponse<T> = await this.httpService.axiosRef.get(
        URL,
        {
          headers,
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get data from Github API', error.message);
      this.handleError(error);
    }
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.githubToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  private handleError(error: any): void {
    const statusCode =
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.response?.data?.message || 'Internal server error';
    throw new HttpException(message, statusCode);
  }
}
