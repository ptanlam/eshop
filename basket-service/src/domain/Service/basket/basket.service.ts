import { Injectable, Logger } from '@nestjs/common';
import { DatabaseError, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { Basket } from '../../Models/Basket.model';
import { CreateBasketDto } from '../dtos/createBasket.dtos';

@Injectable()
export class BasketService {
  private readonly logger = new Logger('BasketService');

  constructor(private sequelize: Sequelize) {}

  async createBasket(email: string, basketDTO: CreateBasketDto) {
    try {
      const inserted = await this.sequelize.query(
        `SP_AddItemToBasket @email=:email,@vendorId=:vendorId,@vendorName=:vendorName,@vendorLogoUrl=:vendorLogoUrl,@name=:name,@productId=:productId, ` +
          `@quantity=:quantity,@price=:price,@description=:description,@image=:image,@unit=:unit,@slug=:slug`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            email,
            vendorId: basketDTO.vendorId,
            vendorName: basketDTO.vendorName,
            vendorLogoUrl: basketDTO.vendorLogoUrl,
            name: basketDTO.name,
            productId: basketDTO.productId,
            quantity: basketDTO.quantity,
            price: basketDTO.price,
            description: basketDTO.description,
            image: basketDTO.image,
            unit: basketDTO.unit,
            slug: basketDTO.slug,
          },
        },
      );
      return inserted[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }
  async productPagination(email: string, limit?: Number, offset?: Number) {
    try {
      if (limit < 1 || offset < 0) return [];
      else {
        const basket = await this.sequelize.query(
          'SP_ProductPagination @email=:email,@limit=:limit,@offset=:offset',
          {
            replacements: {
              email,
              limit,
              offset,
            },
            type: QueryTypes.SELECT,
            raw: true,
            mapToModel: true,
            model: Basket,
          },
        );
        return basket;
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getTotalPriceAndProductForEmail(email: string) {
    try {
      const total = await this.sequelize.query(
        'SP_GetTotalPriceInBasketForEmail @email=:email',
        {
          type: QueryTypes.SELECT,
          replacements: { email },
          raw: true,
          mapToModel: true,
          model: Basket,
        },
      );
      return total[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getTotalProductForEmail(email: string) {
    try {
      const total = await this.sequelize.query(
        'SP_GetTotalProduct @email=:email',
        {
          type: QueryTypes.SELECT,
          replacements: { email },
          raw: true,
          mapToModel: true,
          model: Basket,
        },
      );
      return total[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getBasketWithAllItem(email: string) {
    try {
      // const basket = await this.sequelize.query(
      //   `SP_GetBasketWithAllItem @email=:email`,
      //   {
      //     type: QueryTypes.RAW,
      //     replacements: { email },
      //   },
      // );
      // if (typeof basket !== null) {
      //   const baskets: string | any = Object.values(basket[0])
      //     .map((each: string | any) => {
      //       return Object.values(each)[0];
      //     })
      //     .reduce((acc: string, curr: string) => acc + curr, []);
      //   return baskets;
      // }
      // return [];

      const basket = await this.sequelize.query(
        `SP_GetBasketWithAllItem @email=:email`,
        {
          type: QueryTypes.SELECT,
          replacements: { email },
        },
      );
      if (basket.length > 0) return basket;
      return [];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getNumberItem(email: string): Promise<Number | any> {
    try {
      const basket = await this.sequelize.query(
        `SP_GetNumberItem @email=:email`,
        {
          type: QueryTypes.SELECT,
          replacements: { email },
          raw: true,
          mapToModel: true,
          model: Basket,
        },
      );
      console.log(Object.values(basket[0])[0]);
      return Object.values(basket[0])[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async removeItemInBasket(
    email: string,
    productId: string,
    limit?: number,
    offset?: number,
  ) {
    try {
      if (limit < 1 || offset < 0) return [];
      else {
        const item = await this.sequelize.query(
          `SP_RemoveItemInBasket @email=:email,@productId=:productId,@limit=:limit,@offset=:offset`,
          {
            type: QueryTypes.SELECT,
            replacements: { email, productId, limit, offset },
            raw: true,
            mapToModel: true,
            model: Basket,
          },
        );
        return item[0];
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async removeBasketForUser(email: string) {
    try {
      const item = await this.sequelize.query(
        `SP_RemoveBasketForUser @email=:email`,
        {
          type: QueryTypes.SELECT,
          replacements: { email },
          raw: true,
          mapToModel: true,
          model: Basket,
        },
      );
      return item[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async increaseItemInBasket(email: string, productId: string) {
    try {
      const item = await this.sequelize.query(
        `SP_IncreaseQuantityAndPriceItem @email=:email,@productId=:productId`,
        {
          type: QueryTypes.SELECT,
          replacements: { email, productId },
        },
      );
      return item[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async decreaseItemInBasket(email: string, productId: string) {
    try {
      const item = await this.sequelize.query(
        `SP_DecreaseQuantityAndPriceItem @email=:email,@productId=:productId`,
        {
          type: QueryTypes.SELECT,
          replacements: { email, productId },
        },
      );
      return item[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }
}
