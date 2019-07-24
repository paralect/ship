import { reach } from 'yup';
import _get from 'lodash/get';
import _set from 'lodash/set';


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

    let pathErrors = _get(errors, path);
    pathErrors = pathErrors || [];
    pathErrors.push(err.message);

    _set(errors, path, pathErrors);
  });

  return errors;
};

/**
 * Validate some object using Joi schema
 * @param {object} obj
 * @param {object} schema
 * @return {object}
 */
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

/**
 * Validate field of the object using Joi schema
 * @param {object|string} obj
 * @param {string} field
 * @param {object} schema
 * @return {object}
 */
export const validateField = async (obj, field, schema) => {
  const newSchema = reach(schema, field);

  try {
    const value = await newSchema.validate(_get(obj, field), yupOptions);
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
