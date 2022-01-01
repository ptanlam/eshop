import { Module } from '@nestjs/common';

import { ExchangeModule } from '../exchange_rates/exchange_rates.module';
import { FilesModule } from '../files/files.module';
import { PointUserController } from './pointUser.controller';
import { PointUserService } from './pointUser.service';

@Module({
  imports: [ExchangeModule, FilesModule],
  controllers: [PointUserController],
  providers: [PointUserService],
  exports: [PointUserService],
})
export class PointUserModule {}
