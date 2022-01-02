import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, Observable, of } from 'rxjs';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Product } from 'src/entities/products.entity';
import { databaseToken, discountRepositoryToken } from '../constants';
import { CreateDiscountDto } from '../dtos/create-discount.dto';
import { Discount } from '../entities/discount.entity';
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';
import { ReturnProductsDiscountsResponse } from './interfaces/response';
import { ReturnProductsDiscountsRequest } from './interfaces/resquest';
@Injectable()
export class DiscountsService {
  constructor(
    @Inject(databaseToken)
    private readonly sequelize: Sequelize,
    @Inject(discountRepositoryToken)
    private readonly discountRepository: typeof Discount,
    private readonly exchangeRatesService: ExchangeRatesService,
  ) {}

  async returnProductsDiscounts(
    data: ReturnProductsDiscountsRequest,
  ): Promise<ReturnProductsDiscountsResponse> {
    const temp = await Promise.all(
      data.targets.map(async (target) => {
        const discount = await this.sequelize.query<{
          modifier: number;
          priority: number;
          discountRule: number;
          isFlatAmount: boolean;
          unit: string;
        }>('uspGetDiscountForProduct @productId=:id', {
          type: QueryTypes.SELECT,
          replacements: { id: target.id },
        });

        if (!discount.length)
          return {
            productId: target.id,
            percentage: 0,
            modifiedPrice: target.price,
          };
        let targetAmount = target.price;
        if (target.unit !== discount[0].unit) {
          try {
            const response = await firstValueFrom(
              this.exchangeRatesService.getAmount({
                base: target.unit,
                destination: discount[0].unit,
                amount: target.price,
              }),
            );
            targetAmount = response.amount;

            const { percentage, modifiedPrice } = this.calculatePrice(
              targetAmount,
              discount[0].isFlatAmount,
              discount[0].modifier,
              discount[0].discountRule,
            );

            const targetCurrency = await firstValueFrom(
              this.exchangeRatesService.getAmount({
                base: discount[0].unit,
                destination: target.unit,
                amount: modifiedPrice,
              }),
            );

            return {
              productId: target.id,
              percentage,
              modifiedPrice: targetCurrency.amount,
            };
          } catch (error) {
            console.error('EXCHANGE CURRENCY SERVICE ERROR:', error.message);

            return {
              productId: target.id,
              percentage: 0,
              modifiedPrice: target.price,
            };
          }
        }
        const { percentage, modifiedPrice } = this.calculatePrice(
          targetAmount,
          discount[0].isFlatAmount,
          discount[0].modifier,
          discount[0].discountRule,
        );
        return {
          productId: target.id,
          percentage,
          modifiedPrice,
        };
      }),
    );
    return { response: temp };
  }

  calculatePrice(
    productPrice: number,
    isFlatAmount: boolean,
    modifier: number,
    discountRule: number,
  ): { percentage: number; modifiedPrice: number } {
    let modifiedPrice;
    if (isFlatAmount) {
      return this.calculateFlatAmount(productPrice, modifier, discountRule);
    } else {
      const reduceAmount = (productPrice * modifier) / 100;
      if (reduceAmount > discountRule)
        modifiedPrice = productPrice - discountRule;
      else modifiedPrice = productPrice - reduceAmount;
    }

    return {
      percentage: 100 - (100.0 * modifiedPrice) / productPrice,
      modifiedPrice,
    };
  }

  calculateFlatAmount(
    price: number,
    modifier: number,
    discountRule: number,
  ): { percentage: number; modifiedPrice: number } {
    let modifiedPrice: number;
    if (price >= discountRule) {
      modifiedPrice = price;
    } else {
      modifiedPrice = price - modifier;
    }
    const percentage = 100 - (100.0 * modifiedPrice) / price;
    return {
      percentage,
      modifiedPrice,
    };
  }

  async createDiscount(createDiscountDto: CreateDiscountDto) {
    try {
      const discount = await this.discountRepository.create<Discount>(
        createDiscountDto,
      );
      return discount;
    } catch (error) {
      return error;
    }
  }

  async findAllDiscount(): Promise<Discount[]> {
    try {
      return await this.discountRepository.findAll<Discount>();
    } catch (error) {
      return error;
    }
  }

  async findDiscountById(id: string) {
    try {
      return this.discountRepository.findOne<Discount>({
        where: { id },
        include: {
          model: Product,
          as: 'products',
          through: { attributes: [] },
          attributes: ['id'],
        },
      });
    } catch (error) {
      return error;
    }
  }

  async findDiscountByVendorId(vendorId: string) {
    try {
      return this.discountRepository.findAll<Discount>({
        where: { vendorId: vendorId },
      });
    } catch (error) {
      return error;
    }
  }
}
