import { Test, TestingModule } from '@nestjs/testing';
import { ScoringService } from './scoring.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('ScoringService', () => {
  let service: ScoringService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: '.env.test' })],
      providers: [ScoringService],
    }).compile();

    service = module.get<ScoringService>(ScoringService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateRepositoryScoreByStars', () => {
    it('should return 100 when the number of stars equals the maxStarsInDataset', () => {
      const stars = configService.get<number>('REPOSITORY_MAX_STARS');
      const score = service.calculateRepositoryScoreByStars(stars);
      expect(score).toBe(100);
    });

    it('should return 0 when the number of stars is 0', () => {
      const stars = 0;
      const score = service.calculateRepositoryScoreByStars(stars);
      expect(score).toBe(0);
    });
  });

  describe('calculateRepositoryScoreByForks', () => {
    it('should return 100 when the number of forks equals the maxForksInDataset', () => {
      const forks = configService.get<number>('REPOSITORY_MAX_FORKS');
      const score = service.calculateRepositoryScoreByForks(forks);
      expect(score).toBe(100);
    });

    it('should return 0 when the number of forks is 0', () => {
      const forks = 0;
      const score = service.calculateRepositoryScoreByForks(forks);
      expect(score).toBe(0);
    });
  });

  describe('calculateRepositoryScoreByRecentUpdates', () => {
    it('should return 100 when the update date is today', () => {
      const updatedAt = new Date();
      const score = service.calculateRepositoryScoreByRecentUpdates(updatedAt);
      expect(score).toBe(100);
    });

    it('should return 0 when the update date is the earliest date in the dataset', () => {
      const updatedAt = new Date(configService.get<number>('REPOSITORY_CREATED_BEFORE_DATE'));
      const score = service.calculateRepositoryScoreByRecentUpdates(updatedAt);
      expect(score).toBe(0);
    });
  });
  describe('calculateRepositoryScore', () => {
    it('should return the max average score of the star, fork, and recent update scores', () => {
      const stars = configService.get<number>('REPOSITORY_MAX_STARS'); // max stars
      const forks = configService.get<number>('REPOSITORY_MAX_FORKS'); // max forks
      const updatedAt = new Date(); // updated today

      const score = service.calculateRepositoryScore(stars, forks, updatedAt);

      expect(score).toBe(100);
    });

    it('should return the min average score of the star, fork, and recent update scores', () => {
      const stars = 0; // max stars
      const forks = 0; // max forks
      const updatedAt = new Date(configService.get<number>('REPOSITORY_CREATED_BEFORE_DATE')); // updated today

      const score = service.calculateRepositoryScore(stars, forks, updatedAt);

      expect(score).toBe(0);
    });
  });
  describe('normalizeScore', () => {
    it('should return 100 when currentScore equals maxScore', () => {
      const score = service.normalizeScore(50, 50);
      expect(score).toBe(100);
    });

    it('should return 0 when currentScore is 0', () => {
      const score = service.normalizeScore(0, 50);
      expect(score).toBe(0);
    });

    it('should return 50 when currentScore is half of maxScore', () => {
      const score = service.normalizeScore(25, 50);
      expect(score).toBe(50);
    });

    it('should return 100 when maxScore is 0', () => {
      const score = service.normalizeScore(0, 0);
      expect(score).toBe(100);
    });
  });
  describe('differenceInDays', () => {
    it('should return the correct number of days between two dates', () => {
      const date1 = new Date('2020-01-01');
      const date2 = new Date('2020-01-10');
      const daysDifference = service.differenceInDays(date1, date2);
      expect(daysDifference).toBe(9);
    });

    it('should return 0 when both dates are the same', () => {
      const date1 = new Date('2020-01-01');
      const date2 = new Date('2020-01-01');
      const daysDifference = service.differenceInDays(date1, date2);
      expect(daysDifference).toBe(0);
    });
  });
});
