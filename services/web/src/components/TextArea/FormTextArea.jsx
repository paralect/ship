import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import TextArea from './TextArea';

const FormTextArea = ({
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
      <TextArea
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

FormTextArea.propTypes = {
  control: PropTypes.shape({}).isRequired,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
};

FormTextArea.defaultProps = {
  defaultValue: '',
};

export default FormTextArea;
