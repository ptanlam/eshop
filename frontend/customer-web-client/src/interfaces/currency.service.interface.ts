import { Observable } from 'rxjs';

export interface ICurrencyService {
  getSupportedList(): Observable<Array<string>>;
}
