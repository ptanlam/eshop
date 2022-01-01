import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';
import { ExchangeRatesService } from './exchange-rates.service';
import { GetAmountRequest } from './interfaces/getAmountRequest.interface';
import { GetAmountResponse } from './interfaces/getAmountResponse.interface';

@Controller('rates')
export class ExchangeRatesController {
  constructor(private readonly _service: ExchangeRatesService) {}

  @GrpcMethod('ExchangeRatesService')
  getAmount(request: GetAmountRequest): Observable<GetAmountResponse> {
    return this._service
      .getAmount(request.base, request.destination, request.amount)
      .pipe(map((amount) => ({ amount })));
  }
}
