import { FC, useCallback, useMemo, memo } from 'react';

import {
  Badge,
  Button,
  Card,
  Container,
  MediaQuery,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { IconCheck } from '@tabler/icons';

import { subscriptionApi } from 'resources/subscription';

import type { SubscriptionItemType } from 'pages/subscription-plans/subscription-list';
import type { Subscription, subscriptionConstants } from 'resources/subscription';

import { useStyles } from './styles';

type PlanItemPropTypes = {
  interval: subscriptionConstants.Intervals
  plan: SubscriptionItemType,
  onPreviewUpgrade: Function,
  currentSubscription?: Subscription
};

const PlanItem: FC<PlanItemPropTypes> = (props) => {
  const { classes, cx } = useStyles();

  const { interval, plan, onPreviewUpgrade, currentSubscription } = props;

  const subscribeMutation = subscriptionApi.useSubscribe();

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

    subscribeMutation.mutate({ priceId: plan.priceId[interval], interval });
  }, [
    currentSubscription,
    subscribeMutation,
    plan.priceId,
    interval,
    onPreviewUpgrade,
    plan.title,
  ]);

  const priceText = useMemo(() => {
    if (plan.price[interval]) {
      return (
        <>
          <Text sx={{ display: 'inline', fontSize: '48px' }} weight="600">
            $
            {plan.price[interval]}
          </Text>
          <Text
            sx={(theme) => ({
              display: 'inline',
              color: theme.colors.dark[3],
            })}
            size="xs"
          >
            /
            {' '}
            {interval}
          </Text>
        </>
      );
    }

    return <Text sx={{ fontSize: '48px' }} weight="600">Free</Text>;
  }, [interval, plan.price]);

  const renderFeatureList = useCallback(
    () => plan.features.map((item, index) => (
      <Container
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        fluid
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          padding: 0,
        }}
      >
        <IconCheck size={14} className={classes.icon} />
        <Space w={8} />
        <ReactMarkdown components={{ p: 'div' }}>{item}</ReactMarkdown>
      </Container>
    )),
    [classes.icon, plan.features],
  );

  return (
    <MediaQuery smallerThan="sm" styles={{ flex: '1 1 100%', minWidth: '100%' }}>
      <Card
        withBorder
        radius="sm"
        p={32}
        className={cx(classes.card, {
          [classes.active]: isCurrentSubscription,
        })}
      >
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title order={3}>{plan.title}</Title>
          {isCurrentSubscription && (
            <Badge
              size="lg"
              sx={(theme) => ({
                backgroundColor: theme.colors.blue[6],
                color: theme.white,
              })}
            >
              Current plan
            </Badge>
          )}
        </Container>

        <Space h={24} />
        {priceText}
        <Space h={40} />

        <Stack>
          {renderFeatureList()}
        </Stack>

        <Space h={64} />

        {!isCurrentSubscription && (
          <Button
            sx={(theme) => ({ backgroundColor: theme.colors.blue[6] })}
            fullWidth
            onClick={onClick}
          >
            Get
            {' '}
            {plan.title}
          </Button>
        )}
      </Card>
    </MediaQuery>
  );
};

export default memo(PlanItem);
