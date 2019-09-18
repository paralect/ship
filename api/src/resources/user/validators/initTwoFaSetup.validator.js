const validationFunction = async (data, persistentData) => {
  const errors = [];
  const { twoFa: { isEnabled: isTwoFaEnabled } } = pesistentData.state.user;

  if (isTwoFaEnabled) {
    errors.push({ twoFa: 'Two factor authentication is already enabled' });
    return {
      errors,
    };
  }

  return {
    value: {},
    errors,
  };
};

module.exports = [
  validationFunction,
];

