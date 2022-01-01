import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { filter, from, iif, map, mergeMap, of, toArray, zip } from 'rxjs';
import { Op } from 'sequelize';
import { exchangeRatesProviderToken } from '../constants';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { ExchangeRateFromExternal } from './models/exchange-rate-from-external.dto';
import { ResponseFromExternalDto } from './models/response-from-external.dto';

@Injectable()
export class ExchangeRatesService {
  private readonly _today = new Date();
  private readonly _url: string;
  private readonly _apiKey: string;

  constructor(
    configService: ConfigService,
    @Inject(exchangeRatesProviderToken)
    private readonly _repository: typeof ExchangeRate,
    private readonly _httpClient: HttpService,
  ) {
    this._url = configService.get('exchangeRates.url') || '';
    this._apiKey = configService.get('exchangeRates.apiKey') || '';
  }

  getAmount(base: string, destination: string, amount: number) {
    return this.getRates(base, destination).pipe(
      mergeMap((rates) =>
        iif(
          () => !rates[0] || !rates[1],
          of(amount),
          of(true).pipe(map(() => (amount / rates[0]!.rate) * rates[1]!.rate)),
        ),
      ),
    );
  }

  getSupportedCurrencies() {
    return from(
      this._repository.findAll({ where: { date: this._today } }),
    ).pipe(
      mergeMap((rates) =>
        from(rates).pipe(
          map((rate) => rate.currency),
          toArray(),
        ),
      ),
    );
  }

  private getRates(base: string, destination: string) {
    return zip(
      this._repository.findOne({
        where: { [Op.and]: [{ date: this._today }, { currency: base }] },
      }),
      this._repository.findOne({
        where: { [Op.and]: [{ date: this._today }, { currency: destination }] },
      }),
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  getRatesFromExternalService() {
    of(true)
      .pipe(
        filter(() => !!this._url && !!this._apiKey),
        mergeMap(() =>
          this._httpClient.get<ResponseFromExternalDto>(
            `${this._url}?access_key=${this._apiKey}`,
          ),
        ),
      )
      .pipe(
        map((res) => res.data),
        map((data) => this.saveExchangeRate(data.rates, data.date)),
      )
      .subscribe();
  }

  private saveExchangeRate(rates: ExchangeRateFromExternal, date: string) {
    from(Object.keys(rates))
      .pipe(
        mergeMap((symbol) =>
          from(
            this._repository.create({
              currency: symbol,
              rate: rates[symbol],
              date,
            }),
          ),
        ),
      )
      .subscribe();
  }
}
