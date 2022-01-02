import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'node_modules/rxjs/dist/types';
import { exchangeRatesToken } from '../constants';
import { GetAmountRequest } from './interfaces/getAmountRequest.interface';
import { GetAmountResponse } from './interfaces/getAmountResponse.interface';

interface IExchangeRatesService {
  getAmount(data: GetAmountRequest): Observable<GetAmountResponse>;
}

@Injectable()
export class ExchangeRatesService
  implements OnModuleInit, IExchangeRatesService
{
  private _exchangeService: IExchangeRatesService;
  constructor(
    @Inject(exchangeRatesToken)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this._exchangeService = this.client.getService<IExchangeRatesService>(
      'ExchangeRatesService',
    );
  }

  getAmount(data: GetAmountRequest): Observable<GetAmountResponse> {
    return this._exchangeService.getAmount(data);
  }
}
