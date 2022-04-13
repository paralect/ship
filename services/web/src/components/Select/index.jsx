import PropTypes from 'prop-types';

import Select from './Select';
import FormSelect from './FormSelect';

const SelectComponent = ({ ...props }) => (
  props.control
    ? <FormSelect {...props} />
    : <Select {...props} />
);

SelectComponent.propTypes = {
  control: PropTypes.shape({}),
};

SelectComponent.defaultProps = {
  control: null,
};

export default SelectComponent;
