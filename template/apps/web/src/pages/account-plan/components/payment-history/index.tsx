import { FC, useEffect, useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import queryClient from 'query-client';

import {
  Badge,
  Text,
  Stack,
  Skeleton,
} from '@mantine/core';
import { Table, Link } from 'components';
import { IconExternalLink } from '@tabler/icons';

import { paymentApi, PaymentHistoryItem, PaymentStatuses, StripePagination } from 'resources/payment';

import type { ColumnDef } from '@tanstack/react-table';

const PER_PAGE = 5;

const badgeColorMap = {
  [PaymentStatuses.SUCCEEDED]: 'green',
  [PaymentStatuses.FAILED]: 'red',
  [PaymentStatuses.PENDING]: 'orange',
};

const PaymentHistory: FC = () => {
  const [params, setParams] = useState<StripePagination>({ page: 1, perPage: PER_PAGE });

  const {
    data: paymentHistory,
    isFetching,
    remove,
  } = paymentApi.useGetPaymentHistory(params);

  useEffect(() => () => {
    remove();
    queryClient.removeQueries('paymentHistoryCursorId');
  }, [remove]);

  const columns: ColumnDef<PaymentHistoryItem>[] = useMemo(() => [
    {
      accessorKey: 'created',
      header: 'Date',
      cell: (info) => dayjs(info.getValue() as number * 1000).format('DD/MM/YYYY'),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: (info) => `$${(info.getValue() as number || 0) / 100}`,
    },
    {
      accessorKey: 'status',
      header: 'Payment status',
      cell: (info) => (
        <Badge color={badgeColorMap[info.getValue() as PaymentStatuses]}>
          {info.getValue() as string}
        </Badge>
      ),
    },
    {
      accessorKey: 'receipt_url',
      header: 'Receipt',
      cell: (info) => (
        <Link href={info.getValue() as string} inNewTab>
          <IconExternalLink />
        </Link>
      ),
    },
  ], []);

  const renderTable = useCallback(() => {
    if (isFetching) {
      return [1, 2, 3, 4, 5].map((item) => (
        <Skeleton
          key={`sklton-${String(item)}`}
          height={50}
          radius="sm"
          mb="sm"
        />
      ));
    }

    if (!paymentHistory?.data.length) {
      return <Text>Payment history is empty</Text>;
    }

    return (
      <Table
        isStripeTable
        columns={columns}
        data={paymentHistory?.data || []}
        hasMore={paymentHistory?.hasMore}
        page={params.page}
        perPage={PER_PAGE}
        onPageChange={setParams}
      />
    );
  }, [isFetching, columns, paymentHistory, params.page]);

  return (
    <Stack sx={{ flex: '1 1' }}>
      <Text size="md" weight={600}>Payment history</Text>
      {renderTable()}
    </Stack>
  );
};

export default PaymentHistory;
