import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import RadioGroupComponent from './RadioGroup';

const RadioGroup = ({ ...props }) => (
  props.control
    ? <RadioGroupControlled {...props} />
    : <RadioGroupComponent {...props} />
);

const RadioGroupControlled = ({
  name, control, defaultValue, ...props
}) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    render={({ field: { onChange, value } }) => (
      <RadioGroupComponent
        value={props.options.find((c) => (c.value === value))}
        onChange={(v) => onChange(v.value)}
        {...props}
      />
    )}
  />
);

RadioGroupControlled.propTypes = {
  control: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
  })),
};

RadioGroupControlled.defaultProps = {
  defaultValue: '',
  options: [],
};

RadioGroup.propTypes = {
  control: PropTypes.shape({}),
};

RadioGroup.defaultProps = {
  control: null,
};

export default memo(RadioGroup);
