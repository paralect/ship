import TextArea from './index';

export default {
  title: 'Components/Text Area',
  component: TextArea,
  argTypes: {
    label: { name: 'Label', control: 'text', defaultValue: 'Label' },
    placeholder: { name: 'Placeholder', control: 'text', defaultValue: 'Placeholder Text' },
    disabled: {
      options: [true, false],
      control: { type: 'inline-radio' },
      defaultValue: false,
    },
    maxLength: { name: 'Max Length', control: 'number', defaultValue: 500 },
    height: { name: 'Height', control: 'text', defaultValue: '80px' },
    error: {
      message: { name: 'Error', control: 'text', defaultValue: null },
    },
    name: {
      table: {
        disable: true,
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
    onChange: {
      table: {
        disable: true,
      },
    },
    control: {
      table: {
        disable: true,
      },
    },
  },
  decorators: [(Story) => <div style={{ maxWidth: '400px' }}><Story /></div>],
};

const Template = (args) => <TextArea {...args} />;

export const Active = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const Error = Template.bind({});
Error.args = {
  error: {
    message: 'Error message',
  },
};
