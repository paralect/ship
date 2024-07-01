import React, { FC, SyntheticEvent, useCallback } from 'react';
import { Button, Group } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { RoutePath } from 'routes';
import config from 'config';

export type CardPropTypes = {
  redirectUrl?: string;
  onCancel: () => void;
};

const Card: FC<CardPropTypes> = ({ redirectUrl, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();

      if (!stripe || !elements) {
        return;
      }

      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: redirectUrl || config.WEB_URL.concat(RoutePath.AccountPlan),
        },
      });

      if (error) {
        showNotification({
          title: 'Error',
          message: error.message,
          color: 'red',
        });
      }
    },
    [stripe, elements, redirectUrl],
  );

  return (
    <form style={{ maxWidth: 400 }} onSubmit={handleSubmit}>
      <PaymentElement />
      <Group mt={16}>
        <Button variant="outline" type="submit" disabled={!stripe}>
          Confirm
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </Group>
    </form>
  );
};

export default Card;
