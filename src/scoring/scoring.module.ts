import { Module } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
