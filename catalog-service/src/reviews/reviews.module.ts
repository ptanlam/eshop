import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { reviewsProvider } from './reviews.provider';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [ConfigModule],
  providers: [...reviewsProvider, ReviewsService],
  exports: [...reviewsProvider, ReviewsService],
})
export class ReviewsModule {}
