import Joi from 'joi-browser';
import _isEmpty from 'lodash/isEmpty';

import { validate, validateField } from 'helpers/validation';
import * as api from './user.api';

const schema = {
  firstName: Joi.string()
    .trim()
    .options({
      language: {
        any: { empty: '!!Your first name must be longer then 1 letter' },
      },
    }),
  lastName: Joi.string()
    .trim()
    .options({
      language: {
        any: { empty: '!!Your last name must be longer then 1 letter' },
      },
    }),
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .trim()
    .lowercase()
    .options({
      language: {
        string: { email: '!!Please enter a valid email address' },
        any: { empty: '!!Email is required' },
      },
    }),
};

export const FETCH_USER = 'fetchUser';
export const UPDATE_USER = 'updateUser';

export const fetchUser = id => dispatch =>
  api.fetchUser(id).then(payload => dispatch({ type: FETCH_USER, payload }));

export const validateUserField = (data, field) => {
  return validateField(data, field, schema);
};

export const validateUser = (data) => {
  const result = validate(data, schema);
  const isValid = _isEmpty(result.errors);

  return {
    errors: {
      ...result.errors,
      global: 'Validation Error.',
    },
    isValid,
  };
};

export const updateUser = (id, data) => (dispatch) => {
  return api.updateUser(id, data).then((payload) => {
    dispatch({
      type: UPDATE_USER,
      payload,
    });
    return payload;
  });
};
