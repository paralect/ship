import { FC, memo, useCallback, useMemo, useState } from 'react';
import { Group, Stack, Stepper } from '@mantine/core';

import { ShipLightImage } from 'public/images';

import { accountApi } from 'resources/account';

import queryClient from 'query-client';

import CheckboxForm from './components/CheckboxForm';
import InvitesForm from './components/InvitesForm';

import { GOALS, ROLES } from './constants';

import { useStyles } from './styles';

interface FormStepProps {
  onSubmit: (name: string, value: string) => void;
  onSkip: () => void;
  onFinish: () => void;
}

type OnboardingData = {
  role: string;
  goal: string;
};

const OnboardingForm: FC = () => {
  const { classes } = useStyles();

  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    role: '',
    goal: '',
  });

  const { mutate: finishOnboarding } = accountApi.useFinishOnboarding<OnboardingData>();

  const formSteps = useMemo<FC<FormStepProps>[]>(() => [
    ({ onSubmit, onSkip }) => (
      <CheckboxForm
        name="role"
        title="What describes best your role?"
        subtitle="We’ll tailor {{Product name}} based on your responses"
        options={ROLES}
        onSubmit={onSubmit}
        onSkip={onSkip}
      />
    ),
    ({ onSubmit, onSkip }) => (
      <CheckboxForm
        name="goal"
        title="What’s your goal today?"
        subtitle="We’ll tailor {{Product name}} based on your responses"
        options={GOALS}
        onSubmit={onSubmit}
        onSkip={onSkip}
      />
    ),
    ({ onFinish }) => <InvitesForm onFinish={onFinish} />,
  ], []);

  const onSubmit = useCallback((name: string, value: string | string[]) => {
    setData((old) => ({
      ...old,
      [name]: value,
    }));

    setStep(step + 1);
  }, [step]);

  const onSkip = useCallback(() => {
    setStep(step + 1);
  }, [step]);

  const onFinish = useCallback(() => {
    finishOnboarding(data, {
      onSuccess: () => {
        queryClient.invalidateQueries('account');
      },
    });
  }, [data, finishOnboarding]);

  const FormStep = formSteps[step];

  return (
    <Group className={classes.container}>
      <Stack className={classes.wrapper}>
        <Stack style={{ width: '470px' }} spacing={90}>
          <Stepper active={step} className={classes.stepper}>
            {Array.from(Array(formSteps.length)).map(() => (
              <Stepper.Step defaultValue="" icon={null} />
            ))}
          </Stepper>

          <FormStep onSubmit={onSubmit} onSkip={onSkip} onFinish={onFinish} />
        </Stack>
      </Stack>

      <Stack className={classes.logoWrapper}>
        <ShipLightImage />
      </Stack>
    </Group>
  );
};

export default memo(OnboardingForm);
