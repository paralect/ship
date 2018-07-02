// @flow

import { string, object } from 'yup';
import _isEmpty from 'lodash/isEmpty';

import { validate, validateField } from 'helpers/validation';
import type { ValidationResultType, ValidationResultErrorsType } from 'helpers/validation/types';
import * as api from './user.api';

import type { ActionType, StateType } from './user.types';

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

type DispatchFnType = (obj: ActionType | Promise<ActionType>) => void;
type VoidFnType = (dispatch: DispatchFnType) => Promise<*>;

export const fetchUser = (id: string): VoidFnType => (dispatch: DispatchFnType): Promise<StateType> => {
  return api.fetchUser(id).then((payload: StateType): StateType => {
    dispatch({ type: FETCH_USER, payload });
    return payload;
  });
};

export const validateUserField = (data: $Shape<StateType>, field: string): Promise<ValidationResultType> => {
  return validateField(data, field, schema);
};

export const validateUser = async (data: $Shape<StateType>): Promise<ValidationResultErrorsType> => {
  const result: ValidationResultType = await validate(data, schema);
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
