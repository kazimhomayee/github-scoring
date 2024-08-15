import { Test, TestingModule } from '@nestjs/testing';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { HttpClientService } from '../http-client/http-client.service';
import { ScoringService } from '../scoring/scoring.service';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { HttpClientModule } from '../http-client/http-client.module';

describe('GithubController', () => {
  let controller: GithubController;
  let redisMock: Redis;

  beforeEach(async () => {
    redisMock = {
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as Redis;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GithubController],
      imports: [HttpClientModule],
      providers: [
        GithubService,
        ScoringService,
        ConfigService,
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: redisMock,
        },
      ],
    }).compile();

    controller = module.get<GithubController>(GithubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
