import { TextInput } from '@mantine/core';

import classes from './TextInput.module.css';

export default TextInput.extend({
  defaultProps: {
    size: 'lg',
  },
  classNames: {
    input: classes.input,
    label: classes.label,
  },
});
