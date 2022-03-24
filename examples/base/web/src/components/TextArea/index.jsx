import PropTypes from 'prop-types';

import TextArea from './TextArea';
import FormTextArea from './FormTextArea';

const TextAreaComponent = ({ ...props }) => (
  props.control
    ? <FormTextArea {...props} />
    : <TextArea {...props} />
);

TextAreaComponent.propTypes = {
  control: PropTypes.shape({}),
};

TextAreaComponent.defaultProps = {
  control: null,
};

export default TextAreaComponent;
