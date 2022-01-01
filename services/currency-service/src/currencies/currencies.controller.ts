import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExchangeRatesService } from '../exchange-rates/exchange-rates.service';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly _service: ExchangeRatesService) {}

  @Get()
  getCurrencies(): Observable<Array<string>> {
    return this._service.getSupportedCurrencies();
  }
}
