import { FC, memo, useCallback } from 'react';
import { z } from 'zod';
import { Stack, Button, Title, Text, useMantineTheme, Chip } from '@mantine/core';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStyles } from './styles';

const schema = z.object({
  value: z.string({ required_error: 'Please choose a value' }),
});

type CheckboxFormParams = {
  value: string;
};

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckboxFormParams>({
    resolver: zodResolver(schema),
    shouldFocusError: false,
  });

  const submit = useCallback((data: CheckboxFormParams) => {
    onSubmit(name, data.value);
  }, [name, onSubmit]);

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
            {...register('value')}
            onChange={(value) => setValue('value', value)}
            multiple={false}
          >
            {options.map((option) => (
              <Chip className={classes.chip} value={option}>{option}</Chip>
            ))}
          </Chip.Group>

          {errors?.value && (
            <Text color="red">
              {errors.value.message}
            </Text>
          )}
        </Stack>

        <Stack>
          <Button onClick={handleSubmit(submit)}>Next step</Button>
          <Button variant="subtle" onClick={onSkip}>Skip</Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(CheckboxForm);
