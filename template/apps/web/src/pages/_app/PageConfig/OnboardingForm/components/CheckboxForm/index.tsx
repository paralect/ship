import { FC, memo, useState } from 'react';
import { Chip, Stack, Button, Title, Text, useMantineTheme } from '@mantine/core';

import { useStyles } from './styles';

interface CheckboxFormProps {
  name: string;
  options: string[];
  title: string;
  subtitle: string;
  onSubmit: (name: string, value: string) => void;
  onSkip: () => void;
}

const CheckboxForm: FC<CheckboxFormProps> = ({
  name,
  title,
  subtitle,
  options,
  onSubmit,
  onSkip,
}) => {
  const { classes } = useStyles();
  const { colors } = useMantineTheme();

  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!value) {
      setError('Please choose a value');

      return;
    }

    setError('');

    onSubmit(name, value);
  };

  return (
    <Stack spacing={32}>
      <Stack spacing={4}>
        <Title size={26} weight={600}>{title}</Title>
        <Text size={18} weight={400} color={colors.gray[5]}>{subtitle}</Text>
      </Stack>

      <Stack spacing={50}>
        <Stack>
          <Chip.Group
            className={classes.chipGroup}
            multiple={false}
            value={value}
            onChange={setValue}
          >
            {options.map((option) => (
              <Chip className={classes.chip} value={option}>{option}</Chip>
            ))}
          </Chip.Group>

          {error && (
            <Text color="red">
              {error}
            </Text>
          )}
        </Stack>

        <Stack>
          <Button onClick={handleSubmit}>Next step</Button>
          <Button variant="subtle" onClick={onSkip}>Skip</Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(CheckboxForm);
