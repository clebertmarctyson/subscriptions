export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  description?: string;
  paymentDate: string;
  status: SubscriptionStatus;
  logo?: string;
  userId: string;
  cancelUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
