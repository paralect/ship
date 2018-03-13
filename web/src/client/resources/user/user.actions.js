// @flow

import Joi from 'joi-browser';
import _isEmpty from 'lodash/isEmpty';

import { validate, validateField } from 'helpers/validation';
import type { ValidationResultType, ValidationResultErrorsType } from 'helpers/validation/types';
import * as api from './user.api';

import type { ActionType, StateType } from './user.types';

const schema = {
  firstName: Joi.string()
    .trim()
    .options({
      language: {
        any: {
          empty: '!!Your first name must be longer than 1 letter',
        },
      },
    }),
  lastName: Joi.string()
    .trim()
    .options({
      language: {
        any: {
          empty: '!!Your last name must be longer than 1 letter',
        },
      },
    }),
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .trim()
    .lowercase()
    .options({
      language: {
        string: {
          email: '!!Please enter a valid email address',
        },
        any: { empty: '!!Email is required' },
      },
    }),
};

export const FETCH_USER = 'fetchUser';
export const UPDATE_USER = 'updateUser';

type DispatchFnType = (obj: ActionType | Promise<ActionType>) => void;
type VoidFnType = (dispatch: DispatchFnType) => Promise<*>;

export const fetchUser = (id: string): VoidFnType => (dispatch: DispatchFnType): Promise<*> => {
  return api.fetchUser(id).then((payload: StateType) => {
    dispatch({ type: FETCH_USER, payload });
  });
};

export const validateUserField = (data: $Shape<StateType>, field: string): ValidationResultType => {
  return validateField(data, field, schema);
};

export const validateUser = (data: $Shape<StateType>): ValidationResultErrorsType => {
  const result: ValidationResultType = validate(data, schema);
  const isValid: boolean = _isEmpty(result.errors);

  return {
    errors: {
      ...result.errors,
      _global: ['Validation Error.'],
    },
    isValid,
  };
};

export const updateUser = (id: string, data: StateType): VoidFnType => (dispatch: DispatchFnType): Promise<*> => {
  return api.updateUser(id, data).then((payload: StateType): StateType => {
    dispatch({
      type: UPDATE_USER,
      payload,
    });
    return payload;
  });
};
