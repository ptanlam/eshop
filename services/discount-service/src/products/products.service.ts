import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import {
  productDiscountRepositoryToken,
  productRepositoryToken,
} from '../constants';
import { DiscountContext } from '../discounts/strategy/discount.context';
import { ProductStrategy } from '../discounts/strategy/product.statergy';
import { ProductDiscount } from '../entities/productDiscount.entity';
import { Product } from '../entities/products.entity';
import { getProductByIdRequest } from './interface/request';
import { getProductByIdResponse } from './interface/response';

import { Observable } from 'rxjs';
interface IProductsService {
  getProductById(
    getProductByIdRequest: getProductByIdRequest,
  ): Observable<getProductByIdResponse>;
}
@Injectable()
export class ProductsService {
  private productService: IProductsService;

  onModuleInit() {
    this.productService = this.client.getService('ProductsService');
  }

  getProductById(
    data: getProductByIdRequest,
  ): Observable<getProductByIdResponse> {
    return this.productService.getProductById(data);
  }

  constructor(
    @Inject(productDiscountRepositoryToken)
    private _productDiscount: typeof ProductDiscount,
    @Inject(productRepositoryToken)
    private _product: typeof Product,
    @Inject('PRODUCT_PACKAGE')
    private readonly client: ClientGrpc,
  ) {}

  private strategy = new ProductStrategy(this._product, this._productDiscount);
  private context = new DiscountContext(this.strategy);

  async addProductToDiscount(productIds: Array<string>, discountId: string) {
    const result = await Promise.all(
      productIds.map(async (productId) => {
        await this.context.findOrCreate(productId);
        const product = await this.context.findOrCreateRelationship(
          productId,
          discountId,
        );
        return product.productId;
      }),
    );
    return result;
  }
}
