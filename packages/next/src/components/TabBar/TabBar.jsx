import { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './TabBar.module.css';

const TabBar = ({
  tabs, currentTab, onChange, withBorder,
}) => (
  <div
    className={cn({
      [styles.withBorder]: withBorder,
    }, styles.tabBar)}
  >
    {tabs.map((tab) => {
      const {
        label, path, count, disabled,
      } = tab;

      return (
        <button
          key={path}
          type="button"
          disabled={disabled}
          onClick={() => onChange(tab)}
          className={cn(styles.tab, {
            [styles.active]: currentTab.path === path,
            [styles.disabled]: disabled,
          })}
        >
          {typeof label === 'function' ? label() : label}
          {count > 0 && <span className={styles.counter}>{count}</span>}
        </button>
      );
    })}
  </div>
);

TabBar.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    component: PropTypes.elementType,
    count: PropTypes.number,
    disabled: PropTypes.bool,
  })).isRequired,
  currentTab: PropTypes.shape({
    label: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    component: PropTypes.elementType,
    count: PropTypes.number,
    disabled: PropTypes.bool,
  }),
  onChange: PropTypes.func.isRequired,
  withBorder: PropTypes.bool,
};

TabBar.defaultProps = {
  currentTab: {},
  withBorder: false,
};

export default memo(TabBar);
