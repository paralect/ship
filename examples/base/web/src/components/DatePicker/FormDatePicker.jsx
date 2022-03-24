import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import DatePicker from './DatePicker';

const FormDatePicker = ({
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
      <DatePicker
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
    )}
  />
);

FormDatePicker.propTypes = {
  control: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
};

FormDatePicker.defaultProps = {
  defaultValue: '',
};

export default FormDatePicker;
