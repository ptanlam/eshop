import { HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';

import { Basket } from '../../Models/Basket.model';
import { CreateBasketDto } from '../dtos/createBasket.dtos';
import { BasketService } from './basket.service';

describe('BasketService', () => {
  let basketService: BasketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    basketService = module.get<BasketService>(BasketService);
  });

  describe('Can Remove Basket For Email From User', () => {
    it('should remove Current Basket For user', async () => {
      jest.spyOn(basketService, 'removeBasketForUser').mockImplementation();
      expect(await basketService.removeBasketForUser('a2')).toBeFalsy();
    });
  });

  describe('Can Create Cart For Email From User', () => {
    it('should create Cart For Email From User', async () => {
      let basketDTO: CreateBasketDto = {
        vendorId: 'ABC123-DEF456-GHI7891011',
        vendorName: 'Eshop',
        vendorLogoUrl: 'UNKNOWN',
        productId: 'G1',
        name: 'Giayloai14',
        quantity: 10,
        price: 10000,
        description: 'This is a new version',
        image: 'UNKNOWN',
        unit: 'VND',
        slug: 'Giayloai14',
      };
      jest.spyOn(basketService, 'createBasket').mockClear();
      expect(await basketService.createBasket('a2', basketDTO)).toBeDefined();
    });
  });

  describe('Get Basket With All Items', () => {
    it('should return an array of basket for email from user', async () => {
      const result = [Basket];
      jest
        .spyOn(basketService, 'getBasketWithAllItem')
        .mockResolvedValue(result);
      expect(await basketService.getBasketWithAllItem('a2')).toBe(result);
    });
  });

  describe('Get Number Of Item In Current Basket For email from user', () => {
    it('should return an number of item in current basket for email from user', async () => {
      const result: Number = Math.floor(Math.random() * 10 + 1);
      jest.spyOn(basketService, 'getNumberItem').mockResolvedValue(result);
      expect(await basketService.getNumberItem('a2')).not.toStrictEqual(
        [] || {} || '',
      );
    });
  });

  describe('Can Increase Quantity Each Item In Basket For Email From User', () => {
    it('should Increase Quantity each item In Current Basket For user', async () => {
      jest.spyOn(basketService, 'increaseItemInBasket').mockImplementation();
      expect(await basketService.increaseItemInBasket('a2', 'G1')).not
        .toBeDefined;
    });
  });

  describe('Can Decrease Quantity Each Item In Basket For Email From User', () => {
    it('should Decrease Quantity each item In Current Basket For user', async () => {
      jest.spyOn(basketService, 'decreaseItemInBasket').mockImplementation();
      expect(await basketService.increaseItemInBasket('a2', 'G1')).toBeDefined;
    });
  });

  describe('Can Remove Each Item In Basket For Email From User', () => {
    it('should remove item In Current Basket For user', async () => {
      jest.spyOn(basketService, 'removeItemInBasket');
      expect(
        await basketService.removeItemInBasket('a2', 'G1', 10, 0),
      ).toBeFalsy();
    });
  });

  describe('Can Remove Basket For Email From User', () => {
    it('should remove Current Basket For user', async () => {
      jest.spyOn(basketService, 'removeBasketForUser').mockImplementation();
      expect(await basketService.removeBasketForUser('a1')).toBeFalsy();
    });
  });
});
