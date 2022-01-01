import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'node_modules/rxjs/dist/types';
import { exchangeRatesProvideToken } from 'src/constants';

import { GetAmountRequest } from '../../../interfaces/Currency/getAmountRequest.interface';
import { GetAmountResponse } from '../../../interfaces/Currency/getAmountResponse.interface';

export interface IExchangeService {
  getAmount(data: GetAmountRequest): Observable<GetAmountResponse>;
}

@Controller()
export class ExchangeService implements OnModuleInit, IExchangeService {
  private exchangeService!: IExchangeService;

  constructor(
    @Inject(exchangeRatesProvideToken) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.exchangeService = this.client.getService<IExchangeService>(
      'ExchangeRatesService',
    );
  }

  getAmount(data: GetAmountRequest): Observable<GetAmountResponse> {
    return this.exchangeService.getAmount(data);
  }
}
