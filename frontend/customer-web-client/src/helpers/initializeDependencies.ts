import {
  BasketService,
  CatalogService,
  CouponService,
  CurrencyService,
  InMemoryBasketService,
  NotificationService,
  OrderingService,
  ReviewService,
  VendorService,
} from '../services';
import { PaymentService } from '../services/payment.service';

export const initializeDependencies = () => {
  const inMemoryBasketService = new InMemoryBasketService();

  return {
    catalogService: new CatalogService(),
    basketService: new BasketService(inMemoryBasketService),
    reviewService: new ReviewService(),
    currencyService: new CurrencyService(),
    vendorService: new VendorService(),
    orderingService: new OrderingService(),
    paymentService: new PaymentService(),
    notificationService: new NotificationService(),
    couponService: new CouponService(),
  };
};
