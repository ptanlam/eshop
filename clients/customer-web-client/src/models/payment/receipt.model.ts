export interface Receipt {
  id: UniqueId;
  paymentId?: string;
  paymentSource?: string;
  type: string;
  amount: number;
  currency: string;
  paid: boolean;
  createdAt: Date;
  updatedAt: Date;
  customer: UniqueId;
}
