import { string, object } from 'yup';
import _isEmpty from 'lodash/isEmpty';

import { validate, validateField } from 'helpers/validation';
import * as api from './user.api';

const schema = object({
  firstName: string()
    .trim()
    .required('Your first name must be longer than 1 letter'),
  lastName: string()
    .trim()
    .required('Your last name must be longer than 1 letter'),
  email: string()
    .trim()
    .lowercase()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

export const FETCH_USER = 'fetchUser';
export const UPDATE_USER = 'updateUser';

export const fetchUser = id => (dispatch) => {
  return api.fetchUser(id).then((payload) => {
    dispatch({ type: FETCH_USER, payload });
    return payload;
  });
};

export const validateUserField = (data, field) => {
  return validateField(data, field, schema);
};

export const validateUser = async (data) => {
  const result = await validate(data, schema);
  const isValid = _isEmpty(result.errors);

  return {
    errors: {
      ...result.errors,
      _global: ['Validation Error.'],
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
