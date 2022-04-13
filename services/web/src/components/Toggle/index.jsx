import PropTypes from 'prop-types';

import Toggle from './Toggle';
import FormToggle from './FormToggle';

const ToggleComponent = ({ ...props }) => (
  props.control
    ? <FormToggle {...props} />
    : <Toggle {...props} />
);

ToggleComponent.propTypes = {
  control: PropTypes.shape({}),
};

ToggleComponent.defaultProps = {
  control: null,
};

export default ToggleComponent;
