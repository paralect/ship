import React, { useState } from 'react';

import Banner from 'components/banner';

export default {
  title: 'Components/Banner',
  component: Banner,
};

const Template = (args) => {
  const [showBanner, setShowBanner] = useState(true);

  const closeBanner = () => {
    setShowBanner(false);
  };

  const learnMore = () => {
    window.open('https://www.wikipedia.org/', '_blank');
  };

  if (showBanner) {
    return (
      <Banner
        {...args}
        text="Wow! We are happy to announce new banner text. "
        buttonText="Learn more"
        onButtonClick={learnMore}
        onClose={closeBanner}
      />
    );
  }
  return <div />;
};

export const Success = Template.bind({});
Success.args = {
  title: 'Info memo title',
  type: 'success',
};

export const Info = Template.bind({});
Info.args = {
  title: 'Info memo title',
  type: 'info',
};

export const Warning = Template.bind({});
Warning.args = {
  title: 'Warning memo title',
  type: 'warning',
};

export const Error = Template.bind({});
Error.args = {
  title: 'Error memo title',
  type: 'error',
};
