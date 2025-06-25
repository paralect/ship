import { FC, ReactNode, useState } from 'react';
import { Checkbox, Stack, Title, Tooltip } from '@mantine/core';
import { useFormContext } from 'react-hook-form';

import { PASSWORD_RULES } from 'app-constants';

interface PasswordRulesRenderProps {
  onFocus: () => void;
  onBlur: () => void;
}

interface PasswordRulesProps {
  render: (props: PasswordRulesRenderProps) => ReactNode;
}

const PasswordRules: FC<PasswordRulesProps> = ({ render }) => {
  const [visible, setVisible] = useState(false);

  const { watch } = useFormContext();

  const password = watch('password', '').trim();

  const rules = [
    {
      title: `Have at least ${PASSWORD_RULES.MIN_LENGTH} characters`,
      done: password.length >= PASSWORD_RULES.MIN_LENGTH && password.length <= PASSWORD_RULES.MAX_LENGTH,
    },
    {
      title: 'Have at least one letter',
      done: /[a-zA-Z]/.test(password),
    },
    {
      title: 'Have at least one number',
      done: /\d/.test(password),
    },
  ];

  const label = (
    <Stack gap={10} p={8} pb={12}>
      <Title order={5}>Password must:</Title>

      <Stack gap={8}>
        {rules.map((rule) => (
          <Checkbox key={rule.title} label={rule.title} checked={rule.done} color="white" iconColor="dark" readOnly />
        ))}
      </Stack>
    </Stack>
  );

  return (
    <Tooltip label={label} opened={visible} withArrow>
      {render({ onFocus: () => setVisible(true), onBlur: () => setVisible(false) })}
    </Tooltip>
  );
};

export default PasswordRules;
