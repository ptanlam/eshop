import { Module } from '@nestjs/common';
import { ReviewersService } from '../../domain/services';
import { reviewersProvider } from '../providers';

@Module({
  providers: [ReviewersService, ...reviewersProvider],
  exports: [ReviewersService, ...reviewersProvider],
})
export class ReviewersModule {}
