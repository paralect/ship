import { Paper } from '@mantine/core';

import classes from './ShadowLoginBanner.module.css';

const ShadowLoginBanner = ({ email }: { email: string }) => (
  <Paper
    className={classes.banner}
    shadow="md"
    h={32}
    fw={600}
    c="white"
    bg="dark.4"
  >
    You currently under the shadow login as &apos;
    {email}
    &apos;
  </Paper>
);

export default ShadowLoginBanner;
