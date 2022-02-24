import PropTypes from 'prop-types';

import Input from './Input';
import FormInput from './FormInput';

const InputComponent = ({ ...props }) => (
  props.control
    ? <FormInput {...props} />
    : <Input {...props} />
);

InputComponent.propTypes = {
  control: PropTypes.shape({}),
};

InputComponent.defaultProps = {
  control: null,
};

export default InputComponent;
