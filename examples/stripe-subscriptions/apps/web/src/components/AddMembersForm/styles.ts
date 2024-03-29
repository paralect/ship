import { createStyles } from '@mantine/core';

export const useStyles = createStyles((
  { colors, white },
) => ({
  form: {
    flexDirection: 'column',
    margin: '8px 0 0',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '16px',
    marginTop: '32px',
  },
  textareaWrapper: {
    minHeight: '144px',
    border: `1px solid ${colors.gray[3]}`,
    borderRadius: '4px',
    cursor: 'text',
    background: white,
  },
  textarea: {
    border: 'none',
    fontSize: '16px',
  },
  error: {
    background: '#FFF',
    borderColor: colors.red[6],
    color: colors.red[6],
  },
  errorMessage: {
    color: colors.red[6],
    fontSize: '14px',
  },
  helpText: {
    color: colors.gray[8],
    fontSize: '14px',
  },
  icon: {
    display: 'flex',
    cursor: 'pointer',
  },
}));
