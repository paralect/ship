import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import Toggle from './Toggle';

const FormToggle = ({
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
      <Toggle
        checked={value}
        onChange={() => onChange(!value)}
        onBlur={onBlur}
        ref={ref}
        {...props}
      />
    )}
  />
);

FormToggle.propTypes = {
  control: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.bool,
};

FormToggle.defaultProps = {
  defaultValue: false,
};

export default FormToggle;
