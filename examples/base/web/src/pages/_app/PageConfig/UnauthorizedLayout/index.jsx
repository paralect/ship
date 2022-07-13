import PropTypes from 'prop-types';

import * as routes from 'routes';
import { LogoDarkImage } from 'public/images';
import { Link } from 'components';

import { useStyles } from './styles';

const UnauthorizedLayout = ({ children }) => {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <header className={classes.header}>
        <Link type="router" href={routes.path.home} underline={false}>
          <LogoDarkImage />
        </Link>

      </header>
      <main className={classes.content}>
        {children}
      </main>
    </div>
  );
};

UnauthorizedLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UnauthorizedLayout;
