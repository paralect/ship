import React from 'react';

import TabBar from './index';

const One = () => <div style={{ marginTop: '24px' }}>One Component</div>;
const Two = () => <div style={{ marginTop: '24px' }}>Two Component</div>;
const Three = () => <div style={{ marginTop: '24px' }}>Three Component</div>;

const tabs = [
  {
    path: 'one',
    label: 'Tab One',
    component: <One />,
    count: 0,
  },
  {
    path: 'two',
    label: 'Tab Two',
    component: <Two />,
    count: 10,
  },
  {
    path: 'three',
    label: 'Tab Three',
    component: <Three />,
    disabled: true,
  },
];

export default {
  title: 'Components/TabBar',
  component: TabBar,
};

const Template = (args) => {
  const [currentTab, setCurrentTab] = React.useState(tabs[0]);

  return (
    <>
      <TabBar
        {...args}
        tabs={tabs}
        currentTab={currentTab}
        onChange={(tab) => setCurrentTab(tab)}
      />
      {currentTab.component}
    </>
  );
};

export const Default = Template.bind({});

export const withBorder = Template.bind({});
withBorder.args = {
  withBorder: true,
};
