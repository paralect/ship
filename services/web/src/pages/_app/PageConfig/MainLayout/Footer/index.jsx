import { Footer as LayoutFooter } from '@mantine/core'

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <LayoutFooter>
      {`Ship ${year} © All rights reserved`}
    </LayoutFooter>
  );
};

export default Footer;
