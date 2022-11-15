import { createStyles } from '@mantine/core';

export const useStyles = createStyles((
  { colors },
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
  },
  textarea: {
    border: 'none',
    fontSize: '14px',
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
  emails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    padding: '8px',
  },
  icon: {
    display: 'flex',
    cursor: 'pointer',
  },
}));
