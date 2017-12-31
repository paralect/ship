import Joi from 'joi-browser';
import _get from 'lodash/get';
import _set from 'lodash/set';

const errorRegExp = /(^[^:\s]+):\s?(.+)/;
const arrayItemRegExp = /[^[]*(\[[^\]]+\]).*/;
const dotRegExp = /^\./;

const joiOptions = {
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

const parseErrors = (error, defaultPath = '') => {
  const errors = {};

  if (!error) {
    return errors;
  }

  if (error.details instanceof Array) {
    error.details.forEach((err) => {
      const path = err.path.join('.') || defaultPath;

      let pathErrors = _get(errors, path);
      pathErrors = pathErrors || [];
      pathErrors.push(err.message);

      _set(errors, path, pathErrors);
    });
  } else if (error instanceof Error) {
    const match = error.message.match(errorRegExp);
    const name = match ? match[1] : error.name;
    const message = match ? match[2] : error.message;

    errors[name] = errors[name] || [];
    errors[name].push(message);
  }

  return errors;
};

/**
 * Get validation field
 * @param {object|string} obj
 * @param {string} field
 * @param {object} schema
 * @return {object}
 */
export const getValidationObject = (obj, field, schema) => {
  const newSchema = {};
  Object.keys(obj).forEach((objField) => {
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
          item._inner.children.forEach((child) => {
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
        schema[objField]._inner.children.forEach((child) => {
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
export const validate = (obj, schema) => {
  const result = Joi.validate(obj, schema, joiOptions);
  const errors = parseErrors(result.error);

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
export const validateField = (obj, field, schema) => {
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
