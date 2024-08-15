import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpClientModule } from './http-client/http-client.module';
import { ScoringModule } from './scoring/scoring.module';
import { GithubModule } from './github/github.module';

@Module({
  imports: [HttpClientModule, GithubModule, ScoringModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
