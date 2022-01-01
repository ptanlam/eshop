import { Module } from '@nestjs/common';
import { ReviewsController } from '../../apis/controllers';
import { ReviewsService } from '../../domain/services';
import { ReviewsGateway } from '../../gateways/reviews.gateway';
import { reviewsProvider } from '../providers';
import { FilesModule } from './files.module';
import { ReactionsModule } from './reactions.module';
import { ReviewersModule } from './reviewers.module';
import { TargetsModule } from './targets.module';

@Module({
  imports: [ReviewersModule, TargetsModule, FilesModule, ReactionsModule],
  controllers: [ReviewsController],
  providers: [ReviewsGateway, ReviewsService, ...reviewsProvider],
})
export class ReviewsModule {}
