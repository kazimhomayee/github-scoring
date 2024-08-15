import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { HttpClientModule } from '../http-client/http-client.module';

@Module({
  imports: [HttpClientModule],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
