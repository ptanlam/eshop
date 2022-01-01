import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { defaultCurrency, defaultHighestPrice, defaultLowestPrice } from 'src/constants';

import { AccumulatePointDto } from '../../dtos/AccumulatePoint.dto';
import { ExchangeService } from '../exchange_rates/exchange_rates.service';
import { PointUserService } from './pointUser.service';

@Controller('points')
export class PointUserController {
  private readonly logger = new Logger('PointController');

  constructor(
    private readonly pointUserService: PointUserService,
    private readonly exchangeService: ExchangeService,
  ) {}

  @Post()
  public async AddPointForUser(@Body() accumulatePointDto: AccumulatePointDto) {
    try {
      const price = await this.getPrice(
        accumulatePointDto.unit,
        defaultCurrency,
        accumulatePointDto.totalPrice,
      );
      accumulatePointDto.unit = price.unit;
      accumulatePointDto.totalPrice = price.amount;

      if (accumulatePointDto.totalPrice <= 0)
        throw new HttpException(
          'Total price must be greater than 0',
          HttpStatus.BAD_REQUEST,
        );

      if (
        accumulatePointDto.totalPrice > 0 &&
        accumulatePointDto.totalPrice < defaultLowestPrice
      ) {
        const pointUser = await this.pointUserService.AddAccumulatePoint(
          accumulatePointDto.email,
          0,
        );
        if (pointUser) {
          const pointUserDetails =
            await this.pointUserService.AddAccumulatePointDetails(
              pointUser.id,
              accumulatePointDto.orderId,
              accumulatePointDto.totalPrice,
              accumulatePointDto.unit,
            );
          return { data: pointUser, details: pointUserDetails };
        }
      } else if (
        accumulatePointDto.totalPrice >= defaultLowestPrice &&
        accumulatePointDto.totalPrice < defaultHighestPrice
      ) {
        accumulatePointDto.basePoint =
          (accumulatePointDto.totalPrice / defaultLowestPrice) * 10;
        const pointUser = await this.pointUserService.AddAccumulatePoint(
          accumulatePointDto.email,
          accumulatePointDto.basePoint,
        );
        if (pointUser) {
          const pointUserDetails =
            await this.pointUserService.AddAccumulatePointDetails(
              pointUser.id,
              accumulatePointDto.orderId,
              accumulatePointDto.totalPrice,
              accumulatePointDto.unit,
            );
          return { data: pointUser, details: pointUserDetails };
        }
      } else if (accumulatePointDto.totalPrice >= defaultHighestPrice) {
        accumulatePointDto.basePoint =
          (accumulatePointDto.totalPrice / defaultHighestPrice) * 20;
        const pointUser = await this.pointUserService.AddAccumulatePoint(
          accumulatePointDto.email,
          accumulatePointDto.basePoint,
        );
        if (pointUser) {
          const pointUserDetails =
            await this.pointUserService.AddAccumulatePointDetails(
              pointUser.id,
              accumulatePointDto.orderId,
              accumulatePointDto.totalPrice,
              accumulatePointDto.unit,
            );
          return { data: pointUser, details: pointUserDetails };
        }
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  @Get()
  public async GetTotalPoint(@Query('email') email: string) {
    try {
      const totalPoint = await this.pointUserService.GetTotalPointForUser(
        email,
      );
      if (totalPoint.length == 0)
        return {
          point: 0,
          totalOrder: 0,
        };
      return totalPoint[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private async getPrice(
    base: string,
    destination: string,
    amount: number,
  ): Promise<{ unit: string; amount: number }> {
    try {
      if (base == destination)
        return {
          unit: base,
          amount,
        };
      const amountResponse = await firstValueFrom(
        this.exchangeService.getAmount({ base, destination, amount }),
      );
      return {
        unit: destination,
        amount: +amountResponse.amount.toFixed(2),
      };
    } catch (error) {
      this.logger.error('Error from exchange rate service:', error.message);
      return {
        unit: base,
        amount: amount,
      };
    }
  }
}
