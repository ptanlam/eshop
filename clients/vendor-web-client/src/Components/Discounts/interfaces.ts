export default interface IDiscount {
  id: string;
  discountName: string;
  description: string;
  priority: number;
  allowedUses: number;
  modifier: number;
  discountRule: number;
  startDate: Date;
  endDate: Date;
  isFlatAmount: boolean;
  isActive: boolean;
  product: IProduct[];
}

//just for testing
interface IProduct {
  name: string;
}
