import { Paper } from '@mantine/core';

import classes from './index.module.css';

const ShadowLoginBanner = ({ email }: { email: string }) => (
  <Paper
    className={classes.banner}
    shadow="md"
    h={32}
    bg="dark.4"
    display="flex"
    fw={600}
    c="white"
  >
    You currently under the shadow login as &apos;
    {email}
    &apos;
  </Paper>
);

export default ShadowLoginBanner;
