const _ = require('lodash');

const Symbols = {
  PERSISTENT: Symbol('persistent'),
};

module.exports.Symbols = Symbols;

const getValidators = (validators = []) => {
  if (_.isFunction(validators)) {
    return [validators];
  }

  if (!Array.isArray(validators) || !validators.every(_.isFunction)) {
    throw Error('Validators must be a function or array of functions');
  }

  return validators;
};

module.exports.validate = (payload, validators = []) => {
  const persistentData = payload[Symbols.PERSISTENT];
  return getValidators(validators).reduce(async (result, validator) => {
    const data = await result;

    if (data.errors.length) {
      return data;
    }

    const validationResult = await validator(data.value, persistentData);

    return {
      errors: validationResult.errors || [],
      value: validationResult.value,
    };
  }, {
    errors: [],
    value: payload,
  });
};
