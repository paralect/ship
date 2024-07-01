import React, { FC, useCallback, useState } from 'react';
import { Badge, Box, Group, SegmentedControl, Space, Stack } from '@mantine/core';
import { Intervals, ItemType, Subscription } from 'app-types';

import { accountApi } from 'resources/account';
import { subscriptionConstants } from 'resources/subscription';

import PlanItem from '../plan-item';
import UpgradeModal from '../upgrade-modal';

const Plans: FC = () => {
  const { data: account } = accountApi.useGet();

  const [interval, setInterval] = useState(Intervals.YEAR);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<{ priceId: string; title: string }>();

  const renderItems = () =>
    subscriptionConstants.items.map((item: ItemType) => (
      <PlanItem
        key={item.priceId[interval]}
        currentSubscription={account?.subscription as Subscription | undefined}
        interval={interval}
        onPreviewUpgrade={setSelectedUpgradePlan}
        plan={item}
      />
    ));

  const onClosePreview = useCallback(() => setSelectedUpgradePlan(undefined), []);

  return (
    <>
      <Stack align="center">
        <Box size="sm">
          <Badge color="orange">Save up to 15%</Badge>
          with yearly subscription
        </Box>
        <Space h={16} />

        <SegmentedControl
          size="md"
          value={interval}
          data={[
            { label: 'Yearly', value: Intervals.YEAR },
            { label: 'Monthly', value: Intervals.MONTH },
          ]}
          onChange={(value) => setInterval(value as Intervals)}
        />
      </Stack>

      <Space h={48} />

      <Group grow align="stretch" m="0 auto" maw="1280px">
        {renderItems()}
      </Group>

      {selectedUpgradePlan && <UpgradeModal plan={selectedUpgradePlan} onClose={onClosePreview} />}
    </>
  );
};

export default Plans;
