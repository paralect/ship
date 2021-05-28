import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import SelectComponent from './Select';

const Select = ({ ...props }) => (
  props.control
    ? <SelectControlled {...props} />
    : <SelectComponent {...props} />
);

const SelectControlled = ({
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
      },
    }) => (
      <SelectComponent
        value={props.isMulti
          ? props.options.filter((val) => value?.includes(val.value))
          : props.options.find((c) => (c.value === value))}
        onChange={props.isMulti
          ? (v) => onChange(v.map((c) => c.value))
          : (v) => onChange(v.value)}
        defaultValue={defaultValue}
        onBlur={onBlur}
        {...props}
      />
    )}
  />
);

SelectControlled.propTypes = {
  control: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  isMulti: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({}),
    ]),
    label: PropTypes.string.isRequired,
  })),
};

SelectControlled.defaultProps = {
  defaultValue: '',
  isMulti: false,
  options: [],
};

Select.propTypes = {
  control: PropTypes.shape({}),
};

Select.defaultProps = {
  control: null,
};

export default memo(Select);
