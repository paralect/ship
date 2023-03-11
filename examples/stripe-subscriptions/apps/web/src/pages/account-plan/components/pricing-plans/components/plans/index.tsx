import { FC, useState, useCallback } from 'react';
import {
  Badge,
  Group,
  SegmentedControl,
  Space,
  Stack,
  Text,
} from '@mantine/core';

import { accountApi } from 'resources/account';
import { subscriptionTypes, subscriptionConstants } from 'resources/subscription';

import PlanItem from '../plan-item';
import UpgradeModal from '../upgrade-modal';

const Plans: FC = () => {
  const { data: account } = accountApi.useGet();

  const [interval, setInterval] = useState(subscriptionTypes.Intervals.Year);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState();

  const renderItems = () => subscriptionConstants.items.map(
    (item: subscriptionTypes.ItemType) => (
      <PlanItem
        key={item.priceId[interval]}
        currentSubscription={account?.subscription}
        interval={interval}
        onPreviewUpgrade={setSelectedUpgradePlan}
        plan={item}
      />
    ),
  );

  const onClosePreview = useCallback(() => setSelectedUpgradePlan(undefined), []);

  return (
    <>
      <Stack
        align="center"
        sx={{ maxWidth: '1280px', margin: '0 auto' }}
      >
        <Text size="sm">
          <Badge color="orange" sx={{ marginRight: '8px' }}>Save up to 15%</Badge>
          with yearly subscription
        </Text>
        <Space h={16} />

        <SegmentedControl
          size="md"
          value={interval}
          data={[
            { label: 'Yearly', value: subscriptionTypes.Intervals.Year },
            { label: 'Monthly', value: subscriptionTypes.Intervals.Month },
          ]}
          onChange={(value: subscriptionTypes.Intervals) => setInterval(value)}
        />
      </Stack>

      <Space h={48} />

      <Group
        grow
        position="center"
        sx={{
          maxWidth: '1280px',
          margin: '0 auto',
          alignItems: 'stretch',
        }}
      >
        {renderItems()}
      </Group>

      {selectedUpgradePlan && (
        <UpgradeModal
          plan={selectedUpgradePlan}
          onClose={onClosePreview}
        />
      )}
    </>
  );
};

export default Plans;
