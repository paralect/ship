import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Modal,
  Stack,
  Space,
  Text,
  Title,
} from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { IconCheck } from '@tabler/icons';

import { RoutePath } from 'routes';
import { subscriptionItems, SubscriptionItemType } from 'pages/pricing-plans/subscription-list';

import { useStyles } from './styles';

const SubscriptionPurchasedModal = () => {
  const { classes } = useStyles();
  const router = useRouter();

  const [opened, setOpened] = useState(false);
  const [activeSubscriptionPlan, setActiveSubscriptionPlan] = useState<SubscriptionItemType>();

  const onClose = useCallback(() => {
    setOpened(false);
    router.replace(RoutePath.Home, undefined, { shallow: true });
  }, [router]);

  useEffect(() => {
    if (router.query.subscriptionPlan) {
      setOpened(true);
      setActiveSubscriptionPlan(subscriptionItems.find(
        (item) => Object.values(item.priceId).includes(router.query.subscriptionPlan as string),
      ));
    }
  }, [router.query.subscriptionPlan]);

  const renderFeatureList = useCallback(
    () => activeSubscriptionPlan?.features.map((item, index) => (
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
    [activeSubscriptionPlan, classes.icon],
  );

  return (
    <Modal
      centered
      overlayOpacity={0}
      title={(
        <Title order={3}>
          Success
        </Title>
      )}
      opened={opened}
      onClose={onClose}
    >
      <Text>You have successfully upgraded your plan.</Text>
      {!!activeSubscriptionPlan && (
        <>
          <Text>List of available features:</Text>
          <Space h={16} />
          <Stack>
            {renderFeatureList()}
          </Stack>
        </>
      )}
    </Modal>
  );
};

export default SubscriptionPurchasedModal;
