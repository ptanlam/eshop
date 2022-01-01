import { exchangeRatesProviderToken } from '../constants';
import { ExchangeRate } from './entities/exchange-rate.entity';

export const exchangeRatesProvider = [
  {
    provide: exchangeRatesProviderToken,
    useValue: ExchangeRate,
  },
];
