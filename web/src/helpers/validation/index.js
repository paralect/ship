import * as yup from 'yup';
import get from 'lodash/get';
import set from 'lodash/set';

const yupOptions = {
  abortEarly: false,
};

const parseErrors = (error, defaultPath = '') => {
  const errors = {};

  if (!error) {
    return errors;
  }

  error.inner.forEach((err) => {
    const path = err.path || defaultPath;

    let pathErrors = get(errors, path);
    pathErrors = pathErrors || [];
    pathErrors.push(err.message);

    set(errors, path, pathErrors);
  });

  return errors;
};

export const validate = async (obj, schema) => {
  try {
    const value = await schema.validate(obj, yupOptions);
    return {
      errors: {},
      value,
    };
  } catch (error) {
    const errors = parseErrors(error);
    return {
      value: obj,
      errors,
    };
  }
};

export const validateField = async (obj, field, schema) => {
  const newSchema = yup.reach(schema, field);

  try {
    const value = await newSchema.validate(get(obj, field), yupOptions);
    return {
      errors: {},
      value,
    };
  } catch (error) {
    const errors = parseErrors(error, field);
    return {
      value: obj,
      errors,
    };
  }
};
