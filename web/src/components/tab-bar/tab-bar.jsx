import React, { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './tab-bar.styles.pcss';

const TabBar = ({
  currentTab, tabs, withBorder, onChange,
}) => (
  <div
    className={cn(styles.tabBar, {
      [styles.withBorder]: withBorder,
    })}
  >
    {tabs.map((tab) => {
      const {
        path, label, count, disabled,
      } = tab;

      const isCurrentTab = currentTab.path === path;
      const handleChange = () => onChange(tab);

      return (
        <button
          key={path}
          type="button"
          className={cn(styles.tab, {
            [styles.active]: isCurrentTab,
            [styles.disabled]: disabled,
          })}
          onClick={handleChange}
        >
          <span>{label}</span>
          {count > 0 && (
            <span
              className={cn(styles.counter, {
                [styles.disabled]: disabled,
              })}
            >
              {tab.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

TabBar.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
  })).isRequired,
  withBorder: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  currentTab: PropTypes.shape({
    path: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
  }),
};

TabBar.defaultProps = {
  withBorder: false,
  currentTab: {},
};

export default memo(TabBar);
