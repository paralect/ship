// @flow

import Joi from 'joi-browser';
import _get from 'lodash/get';
import _set from 'lodash/set';

import type { ValidationResultType, ValidationErrorsType } from './types';

const arrayItemRegExp = /[^[]*(\[[^\]]+\]).*/;
const dotRegExp = /^\./;

const joiOptions: ValidationOptions = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: {
    objects: true,
  },
};

const types = {
  array: 'array',
  object: 'object',
};

const parseErrors = (error?: ValidationError, defaultPath: string = ''): ValidationErrorsType => {
  const errors: ValidationErrorsType = {};

  if (!error) {
    return errors;
  }

  error.details.forEach((err: ValidationErrorItem) => {
    const path = err.path.join('.') || defaultPath;

    let pathErrors = _get(errors, path);
    pathErrors = pathErrors || [];
    pathErrors.push(err.message);

    _set(errors, path, pathErrors);
  });

  return errors;
};

/* eslint-disable flowtype/no-weak-types */

/**
 * Get validation field
 * @param {object|string} obj
 * @param {string} field
 * @param {object} schema
 * @return {object}
 */
export const getValidationObject = (obj: Object, field: string, schema: Object): Object => {
  const newSchema: Object = {};
  Object.keys(obj).forEach((objField: string) => {
    let nextField = field;

    if (schema[objField]) {
      if (schema[objField]._type === types.array) {
        let [, arrayItem] = field.match(arrayItemRegExp) || [];
        arrayItem = arrayItem || '';
        nextField = nextField.replace(`${objField}${arrayItem}`, '').replace(dotRegExp, '');

        const arrayObj = _get(obj[objField], arrayItem);
        const [item] = schema[objField]._inner.items;

        if (item && item._type === types.object) {
          const schemaObj = {};
          item._inner.children.forEach((child: Object) => {
            schemaObj[child.key] = child.schema;
          });

          newSchema[objField] = Joi.array()
            .sparse()
            .items(getValidationObject(arrayObj, nextField, schemaObj));
        } else {
          newSchema[objField] = Joi.array()
            .sparse()
            .items(item);
        }
      } else if (schema[objField]._type === types.object) {
        nextField = nextField.replace(objField, '').replace(dotRegExp, '');

        const schemaObj = {};
        schema[objField]._inner.children.forEach((child: Object) => {
          schemaObj[child.key] = child.schema;
        });

        newSchema[objField] = getValidationObject(obj[objField], nextField, schemaObj);
      } else {
        newSchema[objField] = schema[objField] || Joi.any();
      }
    } else {
      newSchema[objField] = Joi.any();
    }
  });

  return newSchema;
};

/**
 * Validate some object using Joi schema
 * @param {object} obj
 * @param {object} schema
 * @return {object}
 */
export const validate = (obj: Object, schema: Object): ValidationResultType => {
  const result: ValidationResult<Object> = Joi.validate(obj, schema, joiOptions);
  const errors: ValidationErrorsType = parseErrors(result.error);

  return {
    errors,
    value: result.value,
  };
};

/**
 * Validate field of the object using Joi schema
 * @param {object|string} obj
 * @param {string} field
 * @param {object} schema
 * @return {object}
 */
export const validateField = (obj: Object, field: string, schema: Object): ValidationResultType => {
  if (field.indexOf('[') >= 0 && field.indexOf(']') > 0) {
    const fieldValue = _get(obj, field);
    const newObj = {};
    _set(newObj, field, fieldValue);

    const newSchema = getValidationObject(newObj, field, schema);
    return validate(newObj, newSchema);
  }

  const objSchema = schema.isJoi || Joi.object(schema);
  const newSchema = Joi.reach(objSchema, field);

  const result = Joi.validate(_get(obj, field), newSchema);
  const errors = parseErrors(result.error, field);

  return {
    errors,
    value: result.value,
  };
};
