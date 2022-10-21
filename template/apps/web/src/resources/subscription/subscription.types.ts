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
