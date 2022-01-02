import { createContext } from 'react';
import {
  ICatalogService,
  ICouponService,
  ICurrencyService,
  INotificationService,
  IOrderingService,
  IPaymentService,
  IReviewService,
  IVendorService,
} from '../interfaces';

interface ApplicationContextProps {
  catalogService: ICatalogService | null;
  reviewService: IReviewService | null;
  currencyService: ICurrencyService | null;
  vendorService: IVendorService | null;
  orderingService: IOrderingService | null;
  paymentService: IPaymentService | null;
  notificationService: INotificationService | null;
  couponService: ICouponService | null;
}

export const ApplicationContext = createContext<ApplicationContextProps>({
  catalogService: null,
  reviewService: null,
  currencyService: null,
  vendorService: null,
  orderingService: null,
  paymentService: null,
  notificationService: null,
  couponService: null,
});
