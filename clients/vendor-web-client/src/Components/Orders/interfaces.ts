export enum OrderState {
  CREATED = "Created",
  APPROVED = "Approved",
  COMPLETE = "Complete",
}

interface Address {
  id: number;
  country: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  details: string;
}

interface Customer {
  email: string;
  phoneNumber: string;
  fullName: string;
}

interface IOrders {
  id: string;
  customer: Customer;
  address: Address;
  state: OrderState;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  totalPrice: {
    amount: number;
    unit: string;
  };
  items: Item[];
  notes: string;
}

interface Item {
  id: number;
  productId: string;
  name: string;
  quantity: number;
  price: {
    amount: number;
    unit: string;
  };
  totalPrice: {
    amount: number;
    unit: string;
  };
  vendorName: string;
  imageUrl: string;
}

export default IOrders;
