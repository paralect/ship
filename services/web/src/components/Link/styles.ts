import { CSSObject, MantineTheme } from '@mantine/core';

const styles = (
  { colors }: MantineTheme,
  disabled?: boolean,
): CSSObject => ({
  color: disabled ? colors.gray[2] : colors.blue[5],
  display: 'flex',
  gap: '5px',
  pointerEvents: disabled ? 'none' : 'initial',

  '&:hover': {
    color: disabled ? colors.gray[2] : colors.blue[2],
  },
});

export default styles;
