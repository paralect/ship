import Joi from 'joi-browser';
import _isEmpty from 'lodash/isEmpty';

import { validate, validateField } from 'helpers/validation';
import * as api from './user.api';

const schema = {
  username: Joi.string()
    .required()
    .trim()
    .options({
      language: {
        any: {
          required: '!!Username is required',
          empty: '!!Username is required',
        },
      },
    }),
  info: Joi.string()
    .max(200)
    .options({
      language: {
        string: {
          max: '!!Info is too long.',
        },
      },
    }),
};

export const FETCH_USER = 'fetchUser';
export const UPDATE_USER = 'updateUser';
export const USER_ERRORS = 'userErrors';

export const fetchUser = () => dispatch =>
  api.fetchUser().then(payload => dispatch({ type: FETCH_USER, payload }));

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

export const updateUser = ({ username, info }) => (dispatch) => {
  return api.updateUser({ username, info }).then((payload) => {
    dispatch({
      type: UPDATE_USER,
      username,
      info,
      payload,
    });
    return payload;
  });
};
