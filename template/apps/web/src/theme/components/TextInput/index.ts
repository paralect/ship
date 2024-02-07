import { TextInput } from '@mantine/core';
import cx from 'clsx';

import classes from './index.module.css';

export default TextInput.extend({
  defaultProps: {
    size: 'md',
  },
  classNames: (_, props) => ({
    label: cx({
      [classes.error]: props.error,
    }),
  }),
});
