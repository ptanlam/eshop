import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';

import { GET_BASKET_CACHE_KEY, GET_TOTAL_PRICE_QUANTITY_CACHE_KEY } from '../constants/basketCacheKey.constant';
import { BasketService } from './../domain/Service/basket/basket.service';

@Injectable()
export class MessagingService {
  constructor(
    private basketService: BasketService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @RabbitRPC({
    queue: 'order.created.basket',
    exchange: 'order',
    routingKey: '',
    queueOptions: {},
  })
  public async rpcHandleDeleteBasket(msg: any, amqpMsg: ConsumeMessage) {
    console.log(await JSON.parse(amqpMsg.content.toString()).message);

    const messages = await JSON.parse(amqpMsg.content.toString()).message;
    const email: string = messages.customerEmail;
    const products: any[] = messages.items;

    // try {
    //   const pro = products.map(async (item) => {
    //     if (Object.values(item) !== null)
    //       return await this.basketService.removeItemInBasket(
    //         email,
    //         item.productId,
    //       );
    //   });
    //   return pro;
    // } catch (error) {
    //   throw new HttpException(
    //     error.message,
    //     error?.status || HttpStatus.SERVICE_UNAVAILABLE,
    //   );
    // }

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
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
