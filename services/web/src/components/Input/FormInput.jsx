import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import Input from './Input';

const FormInput = ({
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
      <Input
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

FormInput.propTypes = {
  control: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
};

FormInput.defaultProps = {
  defaultValue: '',
  onChange: null,
};

export default FormInput;
