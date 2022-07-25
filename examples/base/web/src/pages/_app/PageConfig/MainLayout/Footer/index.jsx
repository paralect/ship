import { Footer as LayoutFooter } from '@mantine/core';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <LayoutFooter
      sx={(theme) => ({
        marginTop: 'auto',
        padding: '12px 0',
        textAlign: 'center',
        flex: '0 1 auto',
        backgroundColor: theme.colors.gray[0],
        border: 'none',
        fontSize: '12px',
      })}
    >
      {`Ship ${year} © All rights reserved`}
    </LayoutFooter>
  );
};

export default Footer;
