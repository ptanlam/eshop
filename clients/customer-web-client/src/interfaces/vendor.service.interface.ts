import { Observable } from 'rxjs';
import { Vendor } from '../models/vendor';

export interface IVendorService {
  fetchById(id: UniqueId): Observable<Vendor>;
}
