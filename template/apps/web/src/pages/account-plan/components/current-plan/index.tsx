import { FC } from 'react';

import {
  Button,
  Container,
  Group,
  Text,
  Title,
  Stack,
} from '@mantine/core';
import { Table } from 'components';

import type { ColumnDef } from '@tanstack/react-table';
import type { Payment } from 'resources/subscription';

import { useStyles } from './styles';

const CurrentPlan: FC = () => {
  const { classes } = useStyles();

  const columns: ColumnDef<Payment>[] = [
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

  return (
    <>
      <Group
        className={classes.section}
      >
        <Container sx={{ flex: '1 1' }} px={0}>
          <Text size="lg" weight={600}>Current plan</Text>
          <Title order={1}>Starter</Title>
        </Container>
        <Container sx={{ flex: '2 1' }} px={0}>
          <Text size="lg" weight={600}>Next payment</Text>
          <Title sx={{ display: 'inline' }} order={1}>$45.00</Title>
          <Text color="grey" sx={{ marginLeft: '8px' }} component="span">on Oct 11, 2022</Text>
        </Container>
      </Group>

      <Group
        className={classes.section}
      >
        <Container sx={{ flex: '1 1' }} px={0}>
          <Text size="md" weight={600}>Payment method</Text>
          <Text color="grey">Bank of America ****1234</Text>
        </Container>
        <Container sx={{ flex: '2 1' }} px={0}>
          <Button
            variant="outline"
            sx={(theme) => ({
              maxWidth: '250px',
              color: theme.colors.blue[6],
              borderColor: theme.colors.blue[6],
            })}
          >
            Change payment method
          </Button>
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
