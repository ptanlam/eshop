import { HttpStatus } from '@nestjs/common';
import {
  CreateBasketItemsDto,
  CreateBasketDto,
} from './../dtos/createBasket.dtos';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { Basket } from '../../../domain/Models/Basket.model';

describe('BasketController', () => {
  let controller: BasketController;
  let service: BasketService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BasketController],
      providers: [BasketService],
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env'],
        }),
        SequelizeModule.forRoot({
          dialect: 'mssql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        }),
        RedisModule.forRoot({
          config: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
          },
        }),
      ],
    }).compile();

    controller = module.get<BasketController>(BasketController);
    service = module.get<BasketService>(BasketService);
  });

  // describe('Can create Cart For Email From User Successfully', () => {
  //   it('should create Cart For User', async () => {
  //     let result: CreateBasketDto = {
  //       vendorId: 'ABC123-DEF456-GHI7891011',
  //       vendorName: 'Eshop',
  //       vendorLogoUrl: 'UNKNOWN',
  //       productId: 'G1',
  //       name: 'Giayloai14',
  //       quantity: 10,
  //       price: 10000,
  //       description: 'This is a new version',
  //       image: 'UNKNOWN',
  //       unit: 'VND',
  //       slug: 'Giayloai14',
  //     };

  //     let basketDTO: CreateBasketDto = {
  //       vendorId: 'ABC123-DEF456-GHI7891011',
  //       vendorName: 'Eshop',
  //       vendorLogoUrl: 'UNKNOWN',
  //       productId: 'G1',
  //       name: 'Giayloai14',
  //       quantity: 10,
  //       price: 10000,
  //       description: 'This is a new version',
  //       image: 'UNKNOWN',
  //       unit: 'VND',
  //       slug: 'Giayloai14',
  //     };

  //     let exam: [CreateBasketDto] = [
  //       // {
  //       //   vendorId: 'ABC123-DEF456-GHI7891011',
  //       //   vendorName: 'Eshop',
  //       //   vendorLogoUrl: 'UNKNOWN',
  //       //   productId: 'G1',
  //       //   name: 'Giayloai14',
  //       //   quantity: 10,
  //       //   price: 10000,
  //       //   description: 'This is a new version',
  //       //   image: 'UNKNOWN',
  //       //   unit: 'VND',
  //       //   slug: 'Giayloai14',
  //       // },
  //       {
  //         vendorId: 'ABC123-DEF456-GHI7891011',
  //         vendorName: 'Eshop',
  //         vendorLogoUrl: 'UNKNOWN',
  //         productId: 'G1',
  //         name: 'Giayloai14',
  //         quantity: 10,
  //         price: 10000,
  //         description: 'This is a new version',
  //         image: 'UNKNOWN',
  //         unit: 'VND',
  //         slug: 'Giayloai14',
  //       },
  //     ];
  //     let items: CreateBasketItemsDto | undefined[] = [];
  //     jest.spyOn(service, 'createBasket').mockClear();
  //     expect(
  //       await controller.createBasketWithItems('a2', null),
  //     ).toBeUndefined();
  //   });
  // });

  describe('getBasketWithAllItems', () => {
    it('should return an array of items in Basket', async () => {
      const result = [Basket];
      jest.spyOn(service, 'getBasketWithAllItem').mockResolvedValue(result);

      expect(await controller.getBasketWithAllItemByEmail('a2')).not.toEqual([
        null,
      ]);
    });
  });

  describe('getProductPagination', () => {
    it('should return an array of items in Basket with pagination', async () => {
      jest.spyOn(service, 'productPagination').mockClear();

      expect(await controller.getProductPagination('a2', 10, 0)).not.toBe(null);
    });
  });

  describe('getProductPagination', () => {
    it('should return an array of items in Basket with pagination', async () => {
      jest.spyOn(service, 'getTotalProductForEmail').mockClear();

      expect(
        await controller.getProductPagination('a2', 10, 0),
      ).not.toStrictEqual(null);
    });
  });

  describe('getTotalProductAndPrice', () => {
    it('should return an object contain price and product amount', async () => {
      jest.spyOn(service, 'getTotalPriceAndProductForEmail').mockClear();

      expect(await controller.getTotalProductAndPrice('a2')).not.toStrictEqual(
        null,
      );
    });
  });

  describe('getNumberItem', () => {
    it('should return an number of products', async () => {
      let number: Number | any = 0;
      jest.spyOn(service, 'getNumberItem').mockReturnValue(number);

      expect(await controller.getTotalProductAndPrice('a2')).toBeTruthy();
    });
  });

  // describe('increaseItemInBasket', () => {
  //   it('should return true', async () => {
  //     jest.spyOn(service, 'increaseItemInBasket').mockClear();
  //     expect(
  //       await controller.increaseItemInBasket('a2', 'G1'),
  //     ).toHaveBeenCalled();
  //   });
  // });

  describe('removeBasketForUser', () => {
    it('should remove basket for user', async () => {
      jest.spyOn(service, 'removeBasketForUser').mockClear();

      expect(await controller.removeBasketForUser('a2')).not.toBeUndefined();
    });
  });
});
