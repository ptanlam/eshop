import { Observable } from 'rxjs';
import { API_GATEWAY_URL } from '../configs';
import { HttpMethod } from '../enums';
import { ICurrencyService } from '../interfaces';
import { BaseService } from './base.service';

export class CurrencyService extends BaseService implements ICurrencyService {
  private readonly _serviceUrl = `${API_GATEWAY_URL}/currencies`;

  getSupportedList(): Observable<string[]> {
    return this.getHttpClient<Array<string>>({
      url: this._serviceUrl,
      method: HttpMethod.GET,
    });
  }
}
