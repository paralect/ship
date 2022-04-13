import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import RadioGroup from './RadioGroup';

const FormRadioGroup = ({
  name, control, defaultValue, ...props
}) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    render={({ field: { onChange, value } }) => (
      <RadioGroup
        value={props.options.find((c) => (c.value === value))}
        onChange={(v) => onChange(v.value)}
        {...props}
      />
    )}
  />
);

FormRadioGroup.propTypes = {
  control: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
  })),
};

FormRadioGroup.defaultProps = {
  defaultValue: '',
  options: [],
};

export default FormRadioGroup;
