import { FC, memo } from 'react';
import { Title, Text, Stack, TextInput, Divider, Button, useMantineTheme, CopyButton, ActionIcon } from '@mantine/core';

import { CopyIcon } from 'public/icons';

import { AddMembersForm, Link } from 'components';

import { useStyles } from './styles';

interface InvitesFormProps {
  onFinish: () => void;
}

const InvitesForm: FC<InvitesFormProps> = ({ onFinish }) => {
  const { classes } = useStyles();
  const { colors } = useMantineTheme();

  return (
    <Stack spacing={32}>
      <Stack spacing={4}>
        <Title size={26} weight={600}>Invite teammates</Title>
        <Text size={18} weight={400} color={colors.gray[5]}>
          Invite colleagues to collaborate or you can do it later
        </Text>
      </Stack>

      <Stack spacing={0}>
        <Stack spacing={8}>
          <Title order={2}>Refer a friend and earn $50</Title>
          <TextInput
            disabled
            placeholder="https://ship.app/ref/12ov93"
            rightSection={(
              <CopyButton value="https://ship.app/ref/12ov93">
                {({ copy }) => (
                  <ActionIcon onClick={copy}>
                    <CopyIcon />
                  </ActionIcon>
                )}
              </CopyButton>
            )}
          />
          <Link type="url">How it works?</Link>
        </Stack>

        <Divider
          labelPosition="center"
          label="or invite by email"
          className={classes.divider}
        />

        <Stack spacing={12}>
          <AddMembersForm
            onSubmit={onFinish}
            placeholder="Enter multiple emails"
            buttonTitle="Invite"
            buttonFullWidth
          />

          <Button variant="subtle" onClick={onFinish} fullWidth>Skip</Button>
        </Stack>
      </Stack>

    </Stack>
  );
};

export default memo(InvitesForm);
