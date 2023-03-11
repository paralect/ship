import { FC, useLayoutEffect } from 'react';
import config from 'config';

import {
  Loader,
} from '@mantine/core';
import { Elements as StripeProvider } from '@stripe/react-stripe-js';

import { loadStripe } from '@stripe/stripe-js';
import { paymentApi } from 'resources/payment';

import PaymentCard, { PaymentCardPropTypes } from './PaymentCard';

const stripePromise = loadStripe(config.stripePublicKey);
const StripeElementProvider: FC<PaymentCardPropTypes> = (props) => {
  const { onCancel } = props;
  const { data: paymentIntent, isFetched, isError } = paymentApi.useSetupPaymentIntent();

  useLayoutEffect(() => {
    if (isError) {
      onCancel();
    }
  }, [isError, onCancel]);

  if (!isFetched) {
    return <Loader />;
  }

  if (!paymentIntent?.clientSecret) {
    return null;
  }

  return (
    <StripeProvider
      stripe={stripePromise}
      options={{
        clientSecret: paymentIntent?.clientSecret,
      }}
    >
      <PaymentCard {...props} />
    </StripeProvider>
  );
};

export default StripeElementProvider;
