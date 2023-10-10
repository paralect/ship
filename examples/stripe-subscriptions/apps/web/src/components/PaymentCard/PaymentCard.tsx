import { FC, SyntheticEvent, useCallback } from 'react';
import config from 'config';

import { Button, Group } from '@mantine/core';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

import { showNotification } from '@mantine/notifications';
import { RoutePath } from 'routes';

import { useStyles } from './styles';

export type PaymentCardPropTypes = {
  redirectUrl?: string,
  onCancel: () => void,
};

const PaymentCard: FC<PaymentCardPropTypes> = ({ redirectUrl, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();

  const { classes } = useStyles();

  const handleSubmit = useCallback(async (event: SyntheticEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: redirectUrl || config.webUrl.concat(RoutePath.AccountPlan),
      },
    });

    if (error) {
      showNotification({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    }
  }, [stripe, elements, redirectUrl]);

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <PaymentElement />
      <Group className={classes.buttons}>
        <Button variant="outline" className={classes.button} type="submit" compact disabled={!stripe}>Confirm</Button>
        <Button variant="outline" className={classes.button} compact onClick={onCancel}>Cancel</Button>
      </Group>
    </form>
  );
};

export default PaymentCard;
