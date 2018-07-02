// @flow

import { reach } from 'yup';
import type { ValidateOptions, ValidationError, Schema } from 'yup';

import _get from 'lodash/get';
import _set from 'lodash/set';

import type { ValidationResultType, ValidationErrorsType } from './types';

const yupOptions: ValidateOptions = {
  abortEarly: false,
};

const parseErrors = (error?: ValidationError, defaultPath: string = ''): ValidationErrorsType => {
  const errors: ValidationErrorsType = {};

  if (!error) {
    return errors;
  }

  error.inner.forEach((err: ValidationError) => {
    const path: string = err.path || defaultPath;

    let pathErrors = _get(errors, path);
    pathErrors = pathErrors || [];
    pathErrors.push(err.message);

    _set(errors, path, pathErrors);
  });

  return errors;
};

/* eslint-disable flowtype/no-weak-types */

/**
 * Validate some object using Joi schema
 * @param {object} obj
 * @param {object} schema
 * @return {object}
 */
export const validate = async (obj: Object, schema: Schema): Promise<ValidationResultType> => {
  try {
    const value: Object = await schema.validate(obj, yupOptions);
    return {
      errors: {},
      value,
    };
  } catch (error) {
    const errors: ValidationErrorsType = parseErrors(error);
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
export const validateField = async (obj: Object, field: string, schema: Schema): Promise<ValidationResultType> => {
  const newSchema: Schema = reach(schema, field);

  try {
    const value: Object = await newSchema.validate(_get(obj, field), yupOptions);
    return {
      errors: {},
      value,
    };
  } catch (error) {
    const errors: ValidationErrorsType = parseErrors(error, field);
    return {
      value: obj,
      errors,
    };
  }
};
