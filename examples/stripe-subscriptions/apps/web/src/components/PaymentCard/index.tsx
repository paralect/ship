import React, { FC, useLayoutEffect } from 'react';
import { Loader } from '@mantine/core';
import { Elements as StripeProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { paymentApi } from 'resources/payment';

import config from 'config';

import PaymentForm from './payment-form';

const stripePromise = loadStripe(config.STRIPE_PUBLIC_KEY);
const StripeElementProvider: FC<{ onCancel: () => void }> = (props) => {
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
      <PaymentForm {...props} />
    </StripeProvider>
  );
};

export default StripeElementProvider;
