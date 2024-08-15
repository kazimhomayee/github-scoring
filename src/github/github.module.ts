import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { HttpClientModule } from '../http-client/http-client.module';
import { GithubController } from './github.controller';
import { ScoringModule } from '../scoring/scoring.module';

@Module({
  imports: [HttpClientModule, ScoringModule],
  providers: [GithubService],
  exports: [GithubService],
  controllers: [GithubController],
})
export class GithubModule {}
