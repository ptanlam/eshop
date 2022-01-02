import qs from 'qs';
import { Observable } from 'rxjs';
import { API_GATEWAY_URL } from '../configs';
import { HttpMethod } from '../enums';
import { IPaymentService } from '../interfaces';
import { OrderForCreation } from '../models/ordering';
import { Receipt, ReceiptForCreation } from '../models/payment';
import { BaseService } from './base.service';

export class PaymentService extends BaseService implements IPaymentService {
  private readonly _serviceUrl = `${API_GATEWAY_URL}/payment`;

  getClientSecret(
    type: string,
    amount: number,
    currency: string,
    payment_method_types: string[]
  ): Observable<{ client_secret: string }> {
    return this.getHttpClient<{ client_secret: string }>({
      method: HttpMethod.GET,
      url: `${this._serviceUrl}/client-secrets?${qs.stringify({
        type,
        amount,
        currency,
        payment_method_types: payment_method_types.join(','),
      })}`,
    });
  }

  create(
    payment: ReceiptForCreation,
    orders: Omit<OrderForCreation, 'payment'>[],
    customer: { email: string; phone_number: string }
  ): Observable<Receipt> {
    return this.getHttpClient<Receipt>({
      method: HttpMethod.POST,
      url: `${this._serviceUrl}/receipts/`,
      body: { payment, orders, customer },
    });
  }
}
