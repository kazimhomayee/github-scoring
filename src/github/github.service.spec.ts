import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { SearchRepositoriesDto } from './dto/search-repositories.dto';
import { HttpClientService } from '../http-client/http-client.service';
import { HttpClientModule } from '../http-client/http-client.module';
import { ScoringModule } from '../scoring/scoring.module';
import { Redis } from 'ioredis';
import { ScoringService } from '../scoring/scoring.service';

describe('GithubService', () => {
  let service: GithubService;
  let httpClient: HttpClientService;
  let redisMock: Redis;
  let scoringService: ScoringService;

  beforeEach(async () => {
    redisMock = {
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as Redis;

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpClientModule, ScoringModule],
      providers: [
        GithubService,
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: redisMock,
        },
        {
          provide: ScoringService,
          useValue: {
            calculateRepositoryScore: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GithubService>(GithubService);
    httpClient = module.get<HttpClientService>(HttpClientService);
    scoringService = module.get<ScoringService>(ScoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchRepositories', () => {
    it('should return a list of repositories from Github', async () => {
      const searchRepositoriesDto: SearchRepositoriesDto = {
        language: 'javascript',
        createdBefore: '2022-01-01',
      };
      jest.spyOn(httpClient, 'get').mockResolvedValueOnce({ data: [] });
      const response = service.searchRepositories(searchRepositoriesDto);
      expect(response).resolves.toEqual({ data: [] });
    });
  });
  describe('checkConfiguration', () => {
    it('should return the configuration when all values are present', async () => {
      const mockRedisGet = jest
        .spyOn(redisMock, 'get')
        .mockResolvedValueOnce('typescript')
        .mockResolvedValueOnce('2023-01-01')
        .mockResolvedValueOnce('100')
        .mockResolvedValueOnce('50');

      const result = await service.checkConfiguration();

      expect(mockRedisGet).toHaveBeenCalledTimes(4);
      expect(mockRedisGet).toHaveBeenCalledWith('language');
      expect(mockRedisGet).toHaveBeenCalledWith('createdBefore');
      expect(mockRedisGet).toHaveBeenCalledWith('maxStars');
      expect(mockRedisGet).toHaveBeenCalledWith('maxForks');
      expect(result).toEqual({
        language: 'typescript',
        createdBefore: '2023-01-01',
        maxStars: '100',
        maxForks: '50',
      });
    });
  });
  describe('queryBuilder', () => {
    it('should return a valid search query string', () => {
      const searchRepositoriesDto: SearchRepositoriesDto = {
        language: 'javascript',
        createdBefore: '2022-01-01',
      };
      const query = service.queryBuilder(searchRepositoriesDto);

      expect(query).toBe(
        `language:${searchRepositoriesDto.language}+created:<=${searchRepositoriesDto.createdBefore}`,
      );
    });
  });
});
