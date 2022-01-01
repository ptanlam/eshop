import { forwardRef, Module } from '@nestjs/common';
import { DiscountsModule } from '../discounts/discounts.module';
import { ExchangeModule } from '../exchange-rates/exchange-rates.module';
import { FilesModule } from '../files/files.module';
import { BrandsModule } from '../brands/brands.module';
import { CategoriesModule } from '../categories/categories.module';
import { MessagingModule } from '../messaging/messaging.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => MessagingModule),
    ReviewsModule,
    forwardRef(() => CategoriesModule),
    BrandsModule,
    FilesModule,
    DiscountsModule,
    ExchangeModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
