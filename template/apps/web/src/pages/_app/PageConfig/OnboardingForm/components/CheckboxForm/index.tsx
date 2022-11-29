// import { FC, memo, useCallback } from 'react';
import { FC, memo, useState } from 'react';
// import { z } from 'zod';
// import { Stack, Button, Title, Text, Radio, useMantineTheme } from '@mantine/core';
import { Stack, Button, Title, Text, Chip, useMantineTheme } from '@mantine/core';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
import { useStyles } from './styles';

// const schema = z.object({
//   value: z.string(),
// });
//
// type CheckboxFormParams = {
//   value: string;
// };

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

  // const {
  //   register,
  //   handleSubmit: submit,
  //   formState: { errors },
  //   setError,
  //   clearErrors,
  // } = useForm<CheckboxFormParams>({
  //   resolver: zodResolver(schema),
  //   shouldFocusError: false,
  // });

  const handleSubmit = () => {
    if (!value) {
      setError('Please choose a value');

      return;
    }

    setError('');

    onSubmit(name, value);
  };

  // const handleSubmit = useCallback((data: CheckboxFormParams) => {
  //   if (!data.value) {
  //     setError('value', {
  //       message: 'Please choose a value',
  //     });
  //
  //     return;
  //   }
  //
  //   clearErrors('value');
  //
  //   onSubmit(name, data.value);
  // }, [clearErrors, name, onSubmit, setError]);

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
          {/* /!* @ts-ignore *!/ */}
          {/* <Radio.Group {...register('value')}> */}
          {/*  {options.map((option) => ( */}
          {/*    <Radio */}
          {/*      key={option} */}
          {/*      value={option} */}
          {/*      label={option} */}
          {/*    /> */}
          {/*  ))} */}
          {/* </Radio.Group> */}

          {/* {!!errors?.value && ( */}
          {/*  <Text color="red"> */}
          {/*    {errors.value.message} */}
          {/*  </Text> */}
          {/* )} */}

          {error && (
            <Text color="red">
              {error}
            </Text>
          )}
        </Stack>

        <Stack>
          {/* <Button onClick={submit(handleSubmit)}>Next step</Button> */}
          <Button onClick={handleSubmit}>Next step</Button>
          <Button variant="subtle" onClick={onSkip}>Skip</Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(CheckboxForm);
