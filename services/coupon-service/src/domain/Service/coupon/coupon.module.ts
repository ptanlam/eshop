import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { MessagingModule } from 'src/messaging/messageing.module';

import { PointUserModule } from '../accumulatePoint/pointUser.module';
import { ExchangeModule } from '../exchange_rates/exchange_rates.module';
import { FilesModule } from '../files/files.module';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';

@Module({
  imports: [
    forwardRef(() => PointUserModule),
    forwardRef(() => MessagingModule),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    FilesModule,
    ExchangeModule,
  ],
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule {}
