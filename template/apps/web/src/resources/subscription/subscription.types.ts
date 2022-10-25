export interface Subscription {
  _id: string;
  subscriptionId: string,
  priceId: string,
  customer: string,
  status: string,
  startDate: Date,
  endDate: Date,
  cancelAtPeriodEnd: boolean,
}

export interface Payment {
  id: string,
  product: string,
  amount: number,
  status: string,
  date: string,
}
