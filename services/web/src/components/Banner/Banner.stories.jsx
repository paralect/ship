import Banner from './Banner';

export default {
  title: 'Components/Banner',
  component: Banner,
  argTypes: {
    text: { name: 'Text', control: 'text', defaultValue: 'Wow! We are happy to announce new banner text.' },
    buttonText: { name: 'Button text', control: 'text', defaultValue: 'Learn more' },
    type: {
      table: {
        disable: true,
      },
    },
    onButtonClick: {
      table: {
        disable: true,
      },
    },
  },

};

const Template = (args) => {
  const learnMore = () => {
    window.open('https://paralect.com/', '_blank');
  };

  return (<Banner {...args} onButtonClick={learnMore} />);
};

export const Success = Template.bind({});
Success.args = {
  type: 'success',
};

export const Info = Template.bind({});
Info.args = {
  type: 'info',
};

export const Warning = Template.bind({});
Warning.args = {
  type: 'warning',
};

export const Error = Template.bind({});
Error.args = {
  type: 'error',
};
