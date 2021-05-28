import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import ToggleComponent from './Toggle';

const Toggle = ({ ...props }) => (
  props.control
    ? <ToggleControlled {...props} />
    : <ToggleComponent {...props} />
);

const ToggleControlled = ({
  name, control, defaultValue, ...props
}) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    render={({
      field: {
        onChange,
        onBlur,
        value,
        ref,
      },
    }) => (
      <ToggleComponent
        checked={value}
        onChange={() => onChange(!value)}
        onBlur={onBlur}
        ref={ref}
        {...props}
      />
    )}
  />
);

ToggleControlled.propTypes = {
  control: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.bool,
};

ToggleControlled.defaultProps = {
  defaultValue: false,
};

Toggle.propTypes = {
  control: PropTypes.shape({}),
};

Toggle.defaultProps = {
  control: null,
};

export default memo(Toggle);
