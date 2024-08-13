import { Test, TestingModule } from '@nestjs/testing';
import { HttpClientService } from './http-client.service';
import { HttpService } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HttpException } from '@nestjs/common';

describe('HttpClientService', () => {
  let service: HttpClientService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: '.env.test' })],
      providers: [
        HttpClientService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HttpClientService>(HttpClientService);
    httpService = module.get<HttpService>(HttpService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call get method with required parameters', async () => {

    const url = 'https://api.github.com/search/repositories';
    const headers = {
      Authorization: `Bearer sometoken`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }

    jest.spyOn(httpService.axiosRef, 'get').mockImplementationOnce(() => Promise.resolve({}));

    const params = { q: 'value' };

    await service.get(params);
    
    expect(httpService.axiosRef.get).toHaveBeenCalledWith(url, { params, headers });
  });

  it('should throw error on failed request', async () => {

    const errorResponse = {
      response: { status: 500, data: { message: 'Internal server error' } },
    };

    jest.spyOn(httpService.axiosRef, 'get').mockImplementationOnce(() => Promise.reject(errorResponse));

    const params = { q: 'value' };

    await expect(service.get(params)).rejects.toThrow(
      new HttpException('Internal server error', 500)
    );

  });
});
