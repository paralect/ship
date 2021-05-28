import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import InputComponent from './Input';

const Input = ({ ...props }) => (
  props.control
    ? <InputControlled {...props} />
    : <InputComponent {...props} />
);

const InputControlled = ({
  name, control, defaultValue, ...props
}) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    render={({
      field: {
        onChange: controllerOnChange,
        onBlur,
        value,
        ref,
      },
    }) => (
      <InputComponent
        {...props}
        value={value}
        onChange={(e) => {
          controllerOnChange(e.target.value);
          if (props.onChange) props.onChange(e);
        }}
        onBlur={onBlur}
        ref={ref}
      />
    )}
  />
);

InputControlled.propTypes = {
  control: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
};

InputControlled.defaultProps = {
  defaultValue: '',
  onChange: null,
};

Input.propTypes = {
  control: PropTypes.shape({}),
};

Input.defaultProps = {
  control: null,
};

export default memo(Input);
