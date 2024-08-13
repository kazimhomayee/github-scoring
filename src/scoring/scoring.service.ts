import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  constructor() {
    // TODOL: Inject the ConfigService to get the max stars and forks in the dataset
  }

  // Calculate the score of a repository based on its stars, forks and recent updates
  calculateRepositoryScore(
    stars: number,
    forks: number,
    updatedAt: Date,
  ): number {
    const scoreByStars = this.calculateRepositoryScoreByStars(stars);
    const scoreByForks = this.calculateRepositoryScoreByForks(forks);
    const scoreByRecentUpdates =
      this.calculateRepositoryScoreByRecentUpdates(updatedAt);

    // Calculate the average score of the three scores
    const score = (scoreByStars + scoreByForks + scoreByRecentUpdates) / 3;
    // Round the score to the nearest integer
    return Math.round(score);
  }

  // Calculate the score of a repository based on its stars to a value between 0 and 100
  calculateRepositoryScoreByStars(stars: number): number {
    const maxStarsInDateset = 49259; // temporary static value
    this.logger.debug(`Max stars in dataset: ${maxStarsInDateset}`);
    return this.normalizeScore(stars, maxStarsInDateset);
  }

  // Calculate the score of a repository based on its forks to a value between 0 and 100
  calculateRepositoryScoreByForks(forks: number): number {
    const maxForksInDateset = 20509; // temporary static value
    this.logger.debug(`Max forks in dataset: ${maxForksInDateset}`);
    return this.normalizeScore(forks, maxForksInDateset);
  }

  calculateRepositoryScoreByRecentUpdates(updatedAt: Date): number {
    const earliestDate = new Date('2021-01-01');
    const currentDate = new Date();

    this.logger.debug(`Earliest created date configured: ${earliestDate}`);

    // Calculate the score based on the difference between the current date and the last update date
    return this.normalizeScore(
      this.differenceInDays(earliestDate, updatedAt),
      this.differenceInDays(earliestDate, currentDate),
    );
  }

  // Normalize the score to a value between 0 and 100
  normalizeScore(currentScore: number, maxScore: number): number {
    if (maxScore === 0) {
      return 100;
    }

    const score = (currentScore / maxScore) * 100;
    return Math.round(score);
  }

  differenceInDays = (date1: Date, date2: Date): number => {
    // Convert both dates to milliseconds
    const date1Milliseconds = date1.getTime();
    const date2Milliseconds = date2.getTime();

    const differenceMilliseconds = date2Milliseconds - date1Milliseconds;

    // Convert milliseconds to days
    return differenceMilliseconds / (1000 * 60 * 60 * 24);
  };
}
