export const getCustomStyle = (isError) => ({
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isDisabled || state.isSelected ? 'var(--gray-light)' : 'var(--white)',
    color: 'var(--black)',
    backgroundImage: state.isSelected && 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'10\' viewBox=\'0 0 12 10\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11.7763 0.501714C12.0514 0.746326 12.0762 1.16771 11.8316 1.4429L4.7205 9.44289C4.59399 9.58522 4.41265 9.66665 4.22223 9.66665C4.0318 9.66665 3.85047 9.58522 3.72396 9.44289L0.168401 5.4429C-0.0762111 5.16771 -0.051424 4.74633 0.223765 4.50171C0.498953 4.2571 0.920335 4.28189 1.16495 4.55708L4.22223 7.99652L10.8351 0.557078C11.0797 0.281889 11.5011 0.257102 11.7763 0.501714Z\' fill=\'black\'/%3E%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top 50% right 12px',
    fontSize: '14px',
    fontWeight: '400',
    borderBottom: '1px solid var(--gray-light)',
    cursor: 'pointer',
    ':active': { backgroundColor: null },
    ':hover': { backgroundColor: 'var(--gray-light)' },
    ':last-child': { borderBottom: 'none' },
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: '2px',
    fontWeight: '400',
    border: '1px solid var(--gray)',
    borderRadius: '6px',
    boxShadow: 'none',
  }),
  control: (provided, state) => {
    const borderColor = state.isFocused
      ? '1px solid var(--blue) !important'
      : '1px solid var(--gray)';

    return ({
      ...provided,
      border: isError
        ? '1px solid var(--red)'
        : borderColor,
      borderRadius: '6px',
      fontWeight: '400',
      boxShadow: 'none',
      fontSize: '14px',
      transition: 'all 0.2s ease-in-out',
      ':hover': {
        border: state.isFocused
          ? '1px solid var(--blue) !important'
          : '1px solid var(--gray-dark) !important',
      },
    });
  },
  dropdownIndicator: (provided, state) => ({
    ...provided,
    padding: '0',
    cursor: 'pointer',
    color: 'var(--gray-dark)',
    transition: 'all .2s ease',
    transform: state.selectProps.menuIsOpen && 'rotate(180deg)',
    ':hover': { color: 'var(--gray-dark)' },
  }),
  indicatorSeparator: () => ({}),
  indicatorsContainer: (provided) => ({
    ...provided,
    width: '38px',
    height: '40px',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    padding: state.isMulti ? '8px 12px 2px 12px' : '0 12px',
    maxHeight: state.isMulti ? '72px' : 'none',
    overflowY: 'auto',
  }),
  input: (provided, state) => ({
    ...provided,
    marginTop: state.isMulti ? '-4px' : '2px',
  }),
  multiValue: (provided, state) => ({
    ...provided,
    background: state.isDisabled
      ? 'var(--gray)'
      : 'var(--gray-light)',
    borderRadius: '6px',
    height: '24px',
    alignItems: 'center',
    padding: '4px 8px',
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    fontSize: '12px',
    color: state.isDisabled
      ? 'var(--gray-dark)'
      : 'var(--black)',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'var(--gray-dark)',
    opacity: '0.7',
    cursor: 'pointer',
    ':hover': { opacity: '1' },
  }),
});
