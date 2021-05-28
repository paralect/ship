import React from 'react';
import cn from 'classnames';

import Spinner from './index';

import styles from './Spinner.stories.css';

export default {
  title: 'Components/Spinner',
  component: Spinner,
  args: {
    theme: 'light',
  },
};

const Template = (args) => {
  const { theme } = args;

  return (
    <div className={cn({
      [styles.darkTheme]: theme === 'dark',
    }, styles.container)}
    >
      <Spinner {...args} />
    </div>
  );
};

export const Active = Template.bind({});
