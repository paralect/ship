import React, { FC, useCallback, useState } from 'react';
import Link from 'next/link';
import { Badge, Skeleton, Stack, Text } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { HistoryItem, Status, StripePagination } from 'app-types';
import dayjs from 'dayjs';

import { paymentApi } from 'resources/payment';

import { Table } from 'components';

const PER_PAGE = 5;

const badgeColorMap = {
  [Status.SUCCEEDED]: 'green',
  [Status.FAILED]: 'red',
  [Status.PENDING]: 'orange',
};

const PaymentStatusBadge: FC<{ status: Status }> = ({ status }) => (
  <Badge color={badgeColorMap[status]}>{status}</Badge>
);

const ReceiptLink = ({ href, target }: { href: string; target?: string }) => (
  <Link href={href} target={target}>
    <IconExternalLink />
  </Link>
);

const columns: ColumnDef<HistoryItem>[] = [
  {
    accessorKey: 'created',
    header: 'Date',
    cell: (info) => dayjs((info.getValue() as number) * 1000).format('DD/MM/YYYY'),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: (info) => `$${((info.getValue() as number) || 0) / 100}`,
  },
  {
    accessorKey: 'status',
    header: 'Payment status',
    cell: (info) => <PaymentStatusBadge status={info.getValue() as Status} />,
  },
  {
    accessorKey: 'receipt_url',
    header: 'Receipt',
    cell: (info) => <ReceiptLink href={info.getValue() as string} target="_blank" />,
  },
];

const PaymentHistory: FC = () => {
  const [params, setParams] = useState<StripePagination>({ page: 1, perPage: PER_PAGE });

  const { data: paymentHistory, isFetching } = paymentApi.useGetPaymentHistory(params);

  const renderTable = useCallback(() => {
    if (isFetching) {
      return [1, 2, 3, 4, 5].map((item) => <Skeleton key={`sklton-${String(item)}`} height={50} radius="sm" mb="sm" />);
    }

    if (!paymentHistory?.data.length) {
      return <Text>Payment history is empty</Text>;
    }

    return (
      <Table
        columns={columns}
        data={paymentHistory?.data || []}
        page={params.page}
        perPage={PER_PAGE}
        onPageChange={setParams}
      />
    );
  }, [isFetching, paymentHistory, params.page]);
  return (
    <Stack flex="1 1">
      <Text size="md" w={600}>
        Payment history
      </Text>
      {renderTable()}
    </Stack>
  );
};
export default PaymentHistory;
