import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'node_modules/rxjs/dist/types';
import { exchangeRatesProvideToken } from '../constants';
import { GetAmountRequest } from './interfaces/getAmountRequest.interface';
import { GetAmountResponse } from './interfaces/getAmountResponse.interface';

interface IExchangeService {
  getAmount(data: GetAmountRequest): Observable<GetAmountResponse>;
}

@Controller()
export class ExchangeService implements OnModuleInit, IExchangeService {
  private _exchangeService!: IExchangeService;

  constructor(
    @Inject(exchangeRatesProvideToken)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this._exchangeService = this.client.getService<IExchangeService>(
      'ExchangeRatesService',
    );
  }
  getAmount(data: GetAmountRequest): Observable<GetAmountResponse> {
    return this._exchangeService.getAmount(data);
  }
}
