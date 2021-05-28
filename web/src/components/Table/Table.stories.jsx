/* eslint-disable object-property-newline */
import React, { useState } from 'react';
import random from 'lodash/random';
import * as sort from 'lodash/sortBy';

import Table from 'components/Table';
import StatusTag from 'components/Table/StatusTag/StatusTag';
import ButtonLink from 'components/Link';

const columns = [
  {
    width: '17%', key: 'name', title: 'Name',
  },
  {
    width: '17%', key: 'title', title: 'Title',
  },
  {
    width: '17%', key: 'email', title: 'Email',
  },
  {
    width: '17%', key: 'role', title: 'Role',
  },
  {
    width: '16%', key: 'status', title: 'Status',
    render: ({ status }) => <StatusTag status={status} />, // eslint-disable-line react/prop-types
  },
  {
    width: '16%', key: 'action', title: 'Action', noSort: true,
    render: () => <ButtonLink text="Action" icon="action" />,
  },
];

const stubUsers = [
  {
    name: 'Cloe Thornton',
    title: 'Administrator',
    email: 'admin@mail.com',
    role: 'Administrator',
    status: 'positive',
  },
  {
    name: 'Magnus Velasquez',
    title: 'Dev',
    email: 'dev1@mail.com',
    role: 'User',
    status: 'neutral',
  },
  {
    name: 'Finley Rhodes',
    title: 'Dev',
    email: 'dev2@mail.com',
    role: 'User',
    status: 'negative',
  },
];
const data = [...Array(51)].map((_, i) => ({ ...stubUsers[random(2)], id: i }));

const PAGE_SIZE = 5;
const TOTAL_COUNT = data.length;
const TOTAL_PAGES = Math.ceil(TOTAL_COUNT / 5);

export default {
  title: 'Components/Table',
  component: Table,
};

export const Template = () => {
  const [items, setItems] = useState(data.slice(0, PAGE_SIZE));

  const dummyRequest = (page, pageSize, sortField, sortDirection) => {
    const newItems = data.slice((page - 1) * pageSize, page * pageSize);
    if (sortField) {
      const ascSortedItems = sort(newItems, sortField);
      if (sortDirection === 1) {
        setItems(ascSortedItems);
      } else {
        setItems(ascSortedItems.reverse());
      }
    } else {
      setItems(newItems);
    }
  };

  return (
    <Table
      items={items}
      columns={columns}
      checkable
      onUpdate={dummyRequest}
      pageSize={PAGE_SIZE}
      totalPages={TOTAL_PAGES}
      itemsCount={items.length}
      totalCount={TOTAL_COUNT}
    />
  );
};
