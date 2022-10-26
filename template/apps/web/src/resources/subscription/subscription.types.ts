interface Product {
  name: string,
  images: string[]
}

interface Invoice {
  subtotal: number,
  tax: number | null,
  total: number,
  status: string,
  created: number,
}

export interface Subscription {
  _id: string;
  subscriptionId: string,
  priceId: string,
  customer: string,
  status: string,
  startDate: number,
  endDate: number,
  cancelAtPeriodEnd: boolean,
  product?: Product,
  pendingInvoice?: Invoice,
}
