import React, { useState } from 'react';

import { ActivateCardIcon, ArchiveIcon } from 'public/icons';

import TabBar from './index';

const One = () => <div style={{ marginTop: '24px' }}>One Component</div>;
const Two = () => <div style={{ marginTop: '24px' }}>Two Component</div>;
const Three = () => <div style={{ marginTop: '24px' }}>Three Component</div>;
const Four = () => <div style={{ marginTop: '24px' }}>Four Component</div>;
const Five = () => <div style={{ marginTop: '24px' }}>Five Component</div>;

const tabs = [
  {
    label: () => (
      <>
        <ActivateCardIcon style={{ marginRight: '4px' }} />
        Tab One
      </>
    ),
    path: 'one',
    component: <One />,
    count: 3,
  },
  {
    label: 'Tab Two',
    path: 'two',
    component: <Two />,
    count: 5,
  },
  {
    label: 'Tab Three',
    path: 'three',
    component: <Three />,
  },
  {
    label: 'Tab Four',
    path: 'four',
    component: <Four />,
    count: 2,
    disabled: true,
  },
  {
    label: () => (
      <>
        <ArchiveIcon style={{ marginRight: '4px' }} />
        Tab Five
      </>
    ),
    path: 'five',
    component: <Five />,

  },
];

export default {
  title: 'Components/Tab Bar',
  component: TabBar,
  argTypes: {
    withBorder: {
      name: 'With border',
      options: [true, false],
      control: { type: 'boolean' },
      defaultValue: false,
    },
    onChange: {
      table: {
        disable: true,
      },
    },
    currentTab: {
      table: {
        disable: true,
      },
    },
    tabs: {
      table: {
        disable: true,
      },
    },
  },
  decorators: [(Story) => <div style={{ maxWidth: '800px' }}><Story /></div>],
};

const Template = (args) => {
  const [currentTab, setCurrentTab] = useState(tabs[0]);

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
