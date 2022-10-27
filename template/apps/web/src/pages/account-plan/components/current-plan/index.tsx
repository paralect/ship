import { FC, useState, useMemo } from 'react';
import dayjs from 'dayjs';

import {
  Button,
  Container,
  Group,
  Text,
  Title,
  Stack,
} from '@mantine/core';
import { Table, PaymentCard } from 'components';

import { subscriptionApi } from 'resources/subscription';
import { accountApi } from 'resources/account';

import type { ColumnDef } from '@tanstack/react-table';
import type { PaymentHistoryItem } from 'resources/payment';

import { useStyles } from './styles';

const CurrentPlan: FC = () => {
  const { classes } = useStyles();

  const { data: currentSubscription } = subscriptionApi.useGetCurrent();
  const { data: paymentInformation } = accountApi.useGetPaymentInformation();

  const [isPaymentCardModalOpened, setIsPaymentCardModalOpened] = useState(false);

  const columns: ColumnDef<PaymentHistoryItem>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'product',
      header: 'Plan name',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'status',
      header: 'Payment status',
      cell: (info) => info.getValue(),
    },
  ];

  const data = {
    items: [{
      id: '1',
      product: 'pro',
      amount: 9900,
      status: 'paid',
      date: '11 10 2011',
    }],
    count: 1,
  };

  const paymentMethodForm = useMemo(() => {
    if (isPaymentCardModalOpened) {
      return (
        <PaymentCard
          onCancel={() => setIsPaymentCardModalOpened(false)}
        />
      );
    }

    return (
      <Button
        variant="outline"
        sx={(theme) => ({
          maxWidth: '250px',
          color: theme.colors.blue[6],
          borderColor: theme.colors.blue[6],
        })}
        onClick={() => setIsPaymentCardModalOpened(!isPaymentCardModalOpened)}
      >
        Change payment method
      </Button>
    );
  }, [setIsPaymentCardModalOpened, isPaymentCardModalOpened]);

  return (
    <>
      <Group
        className={classes.section}
      >
        <Container sx={{ flex: '1 1' }} px={0}>
          <Text size="lg" weight={600}>Current plan</Text>
          <Title order={1}>{currentSubscription?.product?.name}</Title>
        </Container>
        <Container sx={{ flex: '2 1' }} px={0}>
          <Text size="lg" weight={600}>Next payment</Text>
          <Title sx={{ display: 'inline' }} order={1}>
            $
            {(currentSubscription?.pendingInvoice?.amountDue || 0) / 100}
          </Title>
          <Text color="grey" sx={{ marginLeft: '8px' }} component="span">
            on
            {' '}
            {dayjs((currentSubscription?.endDate || 0) * 1000).format('MMM DD, YYYY')}
          </Text>
        </Container>
      </Group>

      <Group
        className={classes.section}
      >
        <Container sx={{ flex: '1 1' }} px={0}>
          <Text size="md" weight={600}>Payment method</Text>
          <Text color="grey">
            {paymentInformation?.card.brand}
            {' '}
            ****
            {paymentInformation?.card.last4}
          </Text>
        </Container>
        <Container sx={{ flex: '2 1' }} px={0}>
          {paymentMethodForm}
        </Container>
      </Group>

      <Group
        grow
        className={classes.section}
      >
        <Stack sx={{ flex: '1 1' }}>
          <Text size="md" weight={600}>Payment history</Text>

          <Table
            columns={columns}
            data={data.items}
            dataCount={data.count}
            perPage={2}
          />
        </Stack>
      </Group>
    </>
  );
};

export default CurrentPlan;
