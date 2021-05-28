import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

import TextAreaComponent from './TextArea';

const TextArea = ({ ...props }) => (
  props.control
    ? <TextAreaControlled {...props} />
    : <TextAreaComponent {...props} />
);

const TextAreaControlled = ({
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
      <TextAreaComponent
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        {...props}
      />
    )}
  />
);

TextAreaControlled.propTypes = {
  control: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
};

TextAreaControlled.defaultProps = {
  defaultValue: '',
};

TextArea.propTypes = {
  control: PropTypes.shape({}),
};

TextArea.defaultProps = {
  control: null,
};

export default memo(TextArea);
