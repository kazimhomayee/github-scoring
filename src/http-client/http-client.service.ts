import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class HttpClientService {
    private readonly githubToken: string = this.configService.get<string>('GITHUB_TOKEN');
    private readonly logger = new Logger(HttpClientService.name);
    private readonly GITHUB_API_URL = this.configService.get<string>('GITHUB_API_URL');
    
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    )  {}

    async get<T>(params?: any): Promise<T> {
        this.logger.debug('Get request to Github API');
        const headers = this.getHeaders();
        const SEARCH_URI = 'search/repositories'

        try {
            const response: AxiosResponse<T> = await this.httpService.axiosRef.get(
              this.GITHUB_API_URL+SEARCH_URI, {
              params,
              headers,
            });
            return response.data;
          } catch (error) {
            this.handleError(error);
          }
      }

      private getHeaders() {
         return {
            Authorization: `Bearer ${this.githubToken}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          }
      }

      private handleError(error: any): void {
        const statusCode = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.response?.data?.message || 'Internal server error';
        throw new HttpException(message, statusCode);
      }

}
