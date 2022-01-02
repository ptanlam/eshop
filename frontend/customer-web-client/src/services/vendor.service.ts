import { Observable } from 'rxjs';
import { API_GATEWAY_URL } from '../configs';
import { HttpMethod } from '../enums';
import { IVendorService } from '../interfaces';
import { Vendor } from '../models/vendor';
import { BaseService } from './base.service';

export class VendorService extends BaseService implements IVendorService {
  private readonly _serviceUrl = `${API_GATEWAY_URL}/vendors`;

  fetchById(id: string): Observable<Vendor> {
    return this.getHttpClient({
      url: `${this._serviceUrl}/${id}`,
      method: HttpMethod.GET,
    });
  }
}
