import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
// import { ConfigModule } from '@nestjs/config';
import { SearchRepositoriesDto } from './dto/search-repositories.dto';
import { HttpClientService } from '../http-client/http-client.service';
import { HttpClientModule } from '../http-client/http-client.module';

describe('GithubService', () => {
  let service: GithubService;
  let httpClient: HttpClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpClientModule],
      providers: [GithubService],
    }).compile();

    service = module.get<GithubService>(GithubService);
    httpClient = module.get<HttpClientService>(HttpClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchRepositories', () => {
    it('should return a list of repositories from Github', async () => {
      const searchRepositoriesDto: SearchRepositoriesDto = {
        language: 'javascript',
        createdBefore: new Date('2022-01-01'),
      };
      jest.spyOn(httpClient, 'get').mockResolvedValueOnce({ data: [] });
      const response = service.searchRepositories(searchRepositoriesDto);
      expect(response).resolves.toEqual({ data: [] });
    });
  });
  describe('queryBuilder', () => {
    it('should return a valid search query string', () => {
      const searchRepositoriesDto: SearchRepositoriesDto = {
        language: 'javascript',
        createdBefore: new Date('2022-01-01'),
      };
      const query = service.queryBuilder(searchRepositoriesDto);

      expect(query).toBe(
        `language:${searchRepositoriesDto.language}+created:<=${searchRepositoriesDto.createdBefore}`,
      );
    });
  });
});
