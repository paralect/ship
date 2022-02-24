import PropTypes from 'prop-types';

import RadioGroup from './RadioGroup';
import FormRadioGroup from './FormRadioGroup';

const RadioGroupComponent = ({ ...props }) => (
  props.control
    ? <FormRadioGroup {...props} />
    : <RadioGroup {...props} />
);

RadioGroupComponent.propTypes = {
  control: PropTypes.shape({}),
};

RadioGroupComponent.defaultProps = {
  control: null,
};

export default RadioGroupComponent;
