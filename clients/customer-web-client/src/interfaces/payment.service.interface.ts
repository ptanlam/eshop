import { Observable } from 'rxjs';
import { OrderForCreation } from '../models/ordering';
import { Receipt, ReceiptForCreation } from '../models/payment';

export interface IPaymentService {
  getClientSecret(
    type: string,
    amount: number,
    currency: string,
    payment_method_types: Array<string>
  ): Observable<{ client_secret: string }>;

  create(
    payment: ReceiptForCreation,
    orders: Array<Omit<OrderForCreation, 'payment'>>,
    customer: { email: string; phone_number: string }
  ): Observable<Receipt>;
}
