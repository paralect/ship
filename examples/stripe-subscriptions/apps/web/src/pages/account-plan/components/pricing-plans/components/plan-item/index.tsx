import React, { FC, memo, useCallback, useMemo } from 'react';
import { Badge, Button, Card, Container, Space, Stack, Text, Title } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { Intervals, ItemType, Subscription } from 'app-types';
import cx from 'clsx';

import { subscriptionApi } from 'resources/subscription';

import classes from './index.module.css';

type PlanItemPropTypes = {
  interval: Intervals;
  plan: ItemType;
  onPreviewUpgrade: (props: { priceId: string; title: string }) => void;
  currentSubscription?: Subscription;
};

const PlanItem: FC<PlanItemPropTypes> = (props) => {
  const { interval, plan, onPreviewUpgrade, currentSubscription } = props;

  const { mutate: updatePlan } = subscriptionApi.useSubscribe();

  const isCurrentSubscription = useMemo(() => {
    if (!currentSubscription) {
      return plan.priceId[interval] === 'price_0';
    }

    return currentSubscription.priceId === plan.priceId[interval];
  }, [currentSubscription, interval, plan.priceId]);

  const onClick = useCallback(() => {
    if (currentSubscription) {
      onPreviewUpgrade({ priceId: plan.priceId[interval], title: plan.title });

      return;
    }

    updatePlan({ priceId: plan.priceId[interval], interval });
  }, [currentSubscription, updatePlan, plan.priceId, plan.title, interval, onPreviewUpgrade]);

  const priceText = useMemo(() => {
    if (plan.price[interval]) {
      return (
        <>
          <Text style={{ fontSize: '48px', display: 'inline' }} w="600">
            ${plan.price[interval]}
          </Text>
          <Text style={{ display: 'inline', color: 'var(--mantine-color-dark-3)' }} size="xs">
            / {interval}
          </Text>
        </>
      );
    }

    return (
      <Text style={{ fontSize: '48px' }} w="600">
        Free
      </Text>
    );
  }, [interval, plan.price]);

  const renderFeatureList = useCallback(
    () =>
      plan.features.map((item) => (
        <Container
          key={item}
          fluid
          classNames={{
            root: classes.list,
          }}
        >
          <IconCheck size={14} color="var(--mantine-color-blue-6)" />
          <Space w={8} />
          <Text>{item}</Text>
        </Container>
      )),
    [plan.features],
  );

  return (
    <Card
      withBorder
      radius="sm"
      p={32}
      className={cx(classes.card, {
        [classes.active]: isCurrentSubscription,
      })}
    >
      <Container style={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex' }}>
        <Title order={3}>{plan.title}</Title>
        {isCurrentSubscription && (
          <Badge size="lg" style={{ backgroundColor: 'var(--mantine-color-blue-6)', color: 'white' }}>
            Current plan
          </Badge>
        )}
      </Container>

      <Space h={24} />
      {priceText}
      <Space h={40} />

      <Stack>{renderFeatureList()}</Stack>

      <Space h={64} />

      {!isCurrentSubscription && (
        <Button style={{ backgroundColor: 'var(--mantine-color-blue-6)' }} fullWidth onClick={onClick}>
          Get {plan.title}
        </Button>
      )}
    </Card>
  );
};

export default memo(PlanItem);
