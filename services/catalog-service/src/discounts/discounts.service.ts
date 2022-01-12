import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'node_modules/rxjs/dist/types';
import { discountPackageProvideToken } from '../constants';
import { ReturnProductsDiscountsResponse } from './interfaces/response';
import { ReturnProductsDiscountsRequest } from './interfaces/resquest';

interface IDiscountsService {
  returnProductsDiscounts(
    data: ReturnProductsDiscountsRequest,
  ): Observable<ReturnProductsDiscountsResponse>;
}

@Injectable()
export class DiscountsService implements OnModuleInit, IDiscountsService {
  private _discountService!: IDiscountsService;

  constructor(
    @Inject(discountPackageProvideToken)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this._discountService =
      this.client.getService<DiscountsService>('DiscountsService');
  }

  returnProductsDiscounts(
    data: ReturnProductsDiscountsRequest,
  ): Observable<ReturnProductsDiscountsResponse> {
    return this._discountService.returnProductsDiscounts(data);
  }
}
