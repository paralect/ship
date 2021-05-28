import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import DatePickerComponent from './DatePicker';

const DatePicker = ({ ...props }) => (
  props.control
    ? <DatePickerControlled {...props} />
    : <DatePickerComponent {...props} />
);

const DatePickerControlled = ({
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
      <DatePickerComponent
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
    )}
  />
);

DatePickerControlled.propTypes = {
  control: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
};

DatePickerControlled.defaultProps = {
  defaultValue: '',
};

DatePicker.propTypes = {
  control: PropTypes.shape({}),
};

DatePicker.defaultProps = {
  control: null,
};

export default memo(DatePicker);
