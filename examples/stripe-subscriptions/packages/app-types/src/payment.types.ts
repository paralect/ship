interface BillingDetails {
  address: {
    city: string | null;
    country: string;
    line1: string | null;
    line2: string | null;
    state: string | null;
  };
  email: string;
  name: string;
  phone: string | null;
}

interface Card {
  brand: string;
  last4: string;
}

export enum Status {
  SUCCEEDED = 'succeeded',
  PENDING = 'pending',
  FAILED = 'failed',
}

export enum StripePageDirections {
  BACK = 'back',
  FORWARD = 'forward',
}

export type StripePagination = {
  page?: number;
  perPage?: number;
  direction?: StripePageDirections;
};

export interface CustomerPaymentInformation {
  balance: number;
  billingDetails: BillingDetails;
  card: Card;
}

export interface HistoryItem {
  id: string;
  description: string;
  amount: number;
  status: Status;
  created: number;
}
