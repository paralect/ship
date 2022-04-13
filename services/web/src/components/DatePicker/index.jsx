import PropTypes from 'prop-types';

import DatePicker from './DatePicker';
import FormDatePicker from './FormDatePicker';

const DatePickerComponent = ({ ...props }) => (
  props.control
    ? <FormDatePicker {...props} />
    : <DatePicker {...props} />
);

DatePickerComponent.propTypes = {
  control: PropTypes.shape({}),
};

DatePickerComponent.defaultProps = {
  control: null,
};

export default DatePickerComponent;
