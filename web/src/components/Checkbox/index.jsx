import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import CheckboxComponent from './Checkbox';

const Checkbox = ({ ...props }) => {
  return props.control
    ? <CheckboxControlled {...props} />
    : <CheckboxComponent {...props} />;
};

const CheckboxControlled = ({
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
      <CheckboxComponent
        checked={value}
        onChange={() => onChange(!value)}
        onBlur={onBlur}
        ref={ref}
        {...props}
      />
    )}
  />
);

CheckboxControlled.propTypes = {
  control: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.bool,
};

CheckboxControlled.defaultProps = {
  defaultValue: false,
};

Checkbox.propTypes = {
  control: PropTypes.shape({}),
};

Checkbox.defaultProps = {
  control: null,
};

export default memo(Checkbox);
