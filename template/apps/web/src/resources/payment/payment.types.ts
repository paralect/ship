interface BillingDetails {
  address: {
    city: string | null,
    country: string,
    line1: string | null,
    line2: string | null,
    postal_code: string | null,
    state: string | null,
  },
  email: string,
  name: string,
  phone: string | null,
}

interface Card {
  brand: string,
  exp_month: number,
  exp_year: number,
  last4: string,
}

export interface CustomerPaymentInformation {
  balance: number,
  billingDetails: BillingDetails,
  card: Card,
}

export interface PaymentHistoryItem {
  id: string,
  product: string,
  amount: number,
  status: string,
  date: string,
}
