import React, {
  memo, forwardRef, useState, useRef,
} from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import DatepickerComponent, { CalendarContainer } from 'react-datepicker';

import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from 'public/icons';

import Input from 'components/Input/Input';
import IconButton from 'components/IconButton';

import { MONTHS } from './constants';

import 'react-datepicker/dist/react-datepicker.css';
import styles from './DatePicker.module.css';

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
      Icon={ArrowLeftIcon}
      disabled={prevMonthButtonDisabled}
      onClick={decreaseMonth}
    />
    {`${MONTHS[date.getMonth()]} ${date.getFullYear()}`}
    <IconButton
      Icon={ArrowRightIcon}
      disabled={nextMonthButtonDisabled}
      onClick={increaseMonth}
    />
  </div>
);

const DatepickerInput = forwardRef(({ ...props }, ref) => {
  const inputRef = useRef(ref);

  return (
    <div className={styles.inputRoot}>
      <Input {...props} onChange={props.onChange} ref={inputRef} />
      <CalendarIcon
        className={cn({
          [styles.active]: props.isOpen,
          [styles.disabled]: props.disabled,
        }, styles.icon)}
        onMouseDown={() => {
          if (!props.isOpen) setTimeout(() => inputRef.current.focus(), 0);
          // replace with a more pretty solution
        }}
      />
    </div>
  );
});

const Datepicker = forwardRef(({
  value, onChange, name, label, placeholder, disabled, error, className,
}, ref) => {
  const [isOpen, setOpen] = useState(false);

  const getDayStyle = (date) => (
    date?.toString() === value?.toString()
      ? styles.selectedDay
      : styles.day
  );
  const getWeekStyle = () => styles.weeks;

  return (
    <div className={cn(className)}>
      <DatepickerComponent
        selected={value}
        onChange={(date) => onChange(date)}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        placeholderText={placeholder}
        popperClassName={styles.popper}
        onCalendarOpen={() => setOpen(true)}
        onCalendarClose={() => setOpen(false)}
        showPopperArrow={false}
        open={isOpen}
        setOpen={setOpen}
        renderCustomHeader={renderHeader}
        calendarContainer={renderContainer}
        weekDayClassName={getWeekStyle}
        dayClassName={getDayStyle}
        customInput={(
          <DatepickerInput
            label={label}
            value={value}
            error={error}
            disabled={disabled}
            isOpen={isOpen}
          />
        )}
        ref={ref}
      />
    </div>
  );
});

Datepicker.propTypes = {
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  onChange: PropTypes.func,
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  className: PropTypes.string,
};

Datepicker.defaultProps = {
  value: null,
  onChange: null,
  name: null,
  label: null,
  placeholder: null,
  disabled: false,
  error: null,
  className: null,
};

DatepickerInput.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};

DatepickerInput.defaultProps = {
  onChange: null,
};

export default memo(Datepicker);
