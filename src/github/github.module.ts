import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { HttpClientModule } from '../http-client/http-client.module';
import { GithubController } from './github.controller';

@Module({
  imports: [HttpClientModule],
  providers: [GithubService],
  exports: [GithubService],
  controllers: [GithubController],
})
export class GithubModule {}
