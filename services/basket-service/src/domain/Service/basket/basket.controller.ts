import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Patch, Post, Query } from '@nestjs/common';

import { CreateBasketItemsDto } from '../dtos/createBasket.dtos';
import { GET_BASKET_CACHE_KEY, GET_TOTAL_PRICE_QUANTITY_CACHE_KEY } from './../../../constants/basketCacheKey.constant';
import { BasketService } from './basket.service';

@Controller('baskets')
export class BasketController {
  private readonly logger = new Logger('BasketController');

  constructor(
    private basketService: BasketService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Post()
  public async createBasketWithItems(
    @Query('email') email: string,
    @Body() createBasketItemsDto: CreateBasketItemsDto,
  ) {
    try {
      const multiProduct = await Promise.all(
        createBasketItemsDto.items.map(async (item) => {
          const basket = await this.basketService.createBasket(email, item);
          return basket;
        }),
      );
      await this.redis.del(GET_BASKET_CACHE_KEY + `${email}`);
      await this.redis.del(GET_TOTAL_PRICE_QUANTITY_CACHE_KEY + `${email}`);
      return multiProduct;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Get()
  public async getBasketWithAllItemByEmail(@Query('email') email: string) {
    try {
      const instance = await this.redis.get(GET_BASKET_CACHE_KEY + `${email}`);
      console.log(instance);
      if (instance) return instance;
      else {
        const data: any = await this.basketService.getBasketWithAllItem(email);
        await this.redis.setex(
          GET_BASKET_CACHE_KEY + `${email}`,
          30,
          JSON.stringify(data),
        );
        return data;
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Get('pagination')
  public async getProductPagination(
    @Query('email') email: string,
    @Query('limit') limit: Number,
    @Query('offset') offset: Number,
  ) {
    try {
      const data = await this.basketService.productPagination(
        email,
        limit,
        offset,
      );

      const total = await this.basketService.getTotalProductForEmail(email);
      if (!Object.values(total)[0] == false) return { data, pagination: total };
      return { data, pagination: { total: 0 } };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Get('total')
  public async getTotalProductAndPrice(@Query('email') email: string) {
    try {
      const instance = await this.redis.get(
        GET_TOTAL_PRICE_QUANTITY_CACHE_KEY + `${email}`,
      );
      console.log(instance);
      if (instance) return instance;
      else {
        const total: any =
          await this.basketService.getTotalPriceAndProductForEmail(email);
        if (Object.values(total)[0] == false || email == null) {
          return { totalPrice: 0, totalQuantity: 0 };
        } else {
          await this.redis.setex(
            GET_TOTAL_PRICE_QUANTITY_CACHE_KEY + `${email}`,
            30,
            JSON.stringify(total),
          );
          return total;
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

  @Get('number')
  public async getNumberItem(
    @Query('email') email: string,
  ): Promise<number | any> {
    try {
      const data: any = await this.basketService.getNumberItem(email);
      return data;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
  // @Permissions('update:basket')
  // @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Patch('product/increase')
  public async increaseItemInBasket(
    @Query('email') email: string,
    @Query('productId') productId: string,
  ) {
    try {
      const value = await this.basketService.increaseItemInBasket(
        email,
        productId,
      );
      if (
        Object.values(value)[0] == false ||
        email == null ||
        productId == null
      )
        throw new HttpException(
          `Can not increase quantity...`,
          HttpStatus.BAD_REQUEST,
        );
      await this.redis.del(GET_BASKET_CACHE_KEY + `${email}`);
      await this.redis.del(GET_TOTAL_PRICE_QUANTITY_CACHE_KEY + `${email}`);
      return value;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  // Object.values(value)[0] == false ||
  // @Permissions('update:basket')
  // @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Patch('product/decrease')
  public async decreaseItemInBasket(
    @Query('email') email: string,
    @Query('productId') productId: string,
  ) {
    try {
      const value = await this.basketService.decreaseItemInBasket(
        email,
        productId,
      );
      if (
        Object.values(value)[0] == false ||
        email == null ||
        productId == null
      )
        throw new HttpException(
          `Can not decrease quantity ...`,
          HttpStatus.BAD_REQUEST,
        );
      await this.redis.del(GET_BASKET_CACHE_KEY + `${email}`);
      await this.redis.del(GET_TOTAL_PRICE_QUANTITY_CACHE_KEY + `${email}`);
      return value;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // @Permissions('delete:basket')
  // @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Delete('product/remove')
  public async removeItemInBasket(
    @Query('email') email: string,
    @Query('productId') productId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    try {
      const item = await this.basketService.removeItemInBasket(
        email,
        productId,
        limit,
        offset,
      );
      if (email == null || productId == null || limit < 1 || offset < 0)
        throw new HttpException(
          `Something was wrong...`,
          HttpStatus.BAD_REQUEST,
        );
      if (typeof item === 'undefined') return 'undefined';

      await this.redis.del(GET_BASKET_CACHE_KEY + `${email}`);
      await this.redis.del(GET_TOTAL_PRICE_QUANTITY_CACHE_KEY + `${email}`);
      return item;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  // @Permissions('delete:basket')
  @Delete('remove')
  public async removeBasketForUser(@Query('email') email: string) {
    try {
      await this.basketService.removeBasketForUser(email);
      if (email == null)
        throw new HttpException(
          `Something was wrong...`,
          HttpStatus.BAD_REQUEST,
        );
      await this.redis.del(GET_BASKET_CACHE_KEY + `${email}`);
      await this.redis.del(GET_TOTAL_PRICE_QUANTITY_CACHE_KEY + `${email}`);
      return HttpStatus.OK;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}

//////////////////// Change logic /////////////////////
