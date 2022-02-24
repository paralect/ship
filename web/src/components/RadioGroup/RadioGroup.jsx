import {
  useCallback, useEffect, useState,
} from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import RadioButton from './RadioButton/RadioButton';
import styles from './RadioGroup.module.css';

const RadioGroup = ({
  value, onChange, options, label, disabled, className,
}) => {
  const [radioGroupOptions, setRadioGroupOptions] = useState(options);

  useEffect(() => {
    setRadioGroupOptions(options.map((option) => {
      const newOption = { ...option };
      newOption.isActive = option.value === value.value;
      return newOption;
    }));
  }, [value.value, options]);

  const handleClick = useCallback((index) => onChange(options[index]), [onChange, options]);

  return (
    <div
      className={cn({
        [styles.disabled]: disabled,
      }, styles.container, className)}
    >
      <label htmlFor="radio" className={styles.label}>{label}</label>
      <div className={styles.radioButtonsContainer}>
        {radioGroupOptions.map((option, index) => (
          <RadioButton
            key={option.value}
            text={option.label}
            checked={option.isActive}
            onChange={() => handleClick(index)}
            disabled={option.isDisabled}
            className={styles.radioButton}
          />
        ))}
      </div>
    </div>
  );
};

RadioGroup.propTypes = {
  value: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
    isDisabled: PropTypes.bool,
  }),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
    isDisabled: PropTypes.bool,
  })),
  label: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

RadioGroup.defaultProps = {
  value: {},
  onChange: null,
  options: [],
  label: null,
  disabled: false,
  className: null,
};

export default RadioGroup;
