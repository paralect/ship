import React, { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import DatePicker, { CalendarContainer } from 'react-datepicker';

import Input from 'components/input';
import IconButton from 'components/icon-button';
import Icon from 'components/icon';
import { MONTHS } from 'helpers/constants';

import 'react-datepicker/dist/react-datepicker.css';

import InputController from '../input-controller';

import styles from './datepicker.styles.pcss';

const iconStyle = { transform: 'rotate(180deg)' };

const renderContainer = ({ children }) => (
  <CalendarContainer className={styles.container}>
    {children}
  </CalendarContainer>
);

const renderHeader = ({
  date, decreaseMonth, increaseMonth,
  prevMonthButtonDisabled, nextMonthButtonDisabled,
}) => (
  <div className={styles.header}>
    <IconButton
      onClick={decreaseMonth}
      style={iconStyle}
      icon="arrowRight"
      disabled={prevMonthButtonDisabled}
    />
    {`${MONTHS[date.getMonth()]} ${date.getFullYear()}`}
    <IconButton
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
      icon="arrowRight"
    />
  </div>
);

const DatepickerInput = forwardRef(({ ...props }, ref) => (
  <div className={styles.inputRoot}>
    <Input {...props} name="" ref={ref} />
    <Icon
      icon="calendar"
      className={styles.icon}
    />
  </div>
));

const DatepickerComponent = ({
  label, disabled, errors, placeholder, onChange, value, name,
}) => {
  const getDayStyle = (date) => (
    date.toString() === value.toString()
      ? styles.selectedDay
      : styles.day
  );
  const getWeekStyle = () => styles.weeks;

  return (
    <DatePicker
      name={name}
      renderCustomHeader={renderHeader}
      value={value}
      selected={value}
      disabled={disabled}
      placeholderText={placeholder}
      onChange={onChange}
      customInput={(
        <DatepickerInput
          name={name}
          label={label}
          errors={errors}
          placeholder={placeholder}
        />
      )}
      calendarContainer={renderContainer}
      popperClassName={styles.popper}
      wrapperClassName={styles.wrapper}
      showPopperArrow={false}
      weekDayClassName={getWeekStyle}
      dayClassName={getDayStyle}
    />
  );
};

const Datepicker = ({ ...props }) => (
  props.name ? (
    <InputController name={props.name} {...props}>
      <DatepickerComponent />
    </InputController>
  ) : <DatepickerComponent {...props} />
);

DatepickerComponent.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  name: PropTypes.string,
};

DatepickerComponent.defaultProps = {
  label: null,
  disabled: false,
  errors: [],
  value: null,
  placeholder: '',
  name: '',
  onChange: () => {},
};

Datepicker.propTypes = {
  name: PropTypes.string,
};

Datepicker.defaultProps = {
  name: '',
};

export default memo(Datepicker);
