import { ExchangeRateFromExternal } from './exchange-rate-from-external.dto';

export class ResponseFromExternalDto {
  success!: boolean;
  timestamp!: number;
  base!: string;
  date!: string;
  rates!: ExchangeRateFromExternal;
}
