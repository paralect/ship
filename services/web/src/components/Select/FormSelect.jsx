import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import Select from './Select';

const FormSelect = ({
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
      <Select
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

FormSelect.propTypes = {
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

FormSelect.defaultProps = {
  defaultValue: '',
  isMulti: false,
  options: [],
};

export default FormSelect;
