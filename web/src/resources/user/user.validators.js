import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty';

import { validate, validateField } from 'helpers/validation';

const schema = yup.object({
  firstName: yup.string()
    .trim()
    .required('First name is required'),
  lastName: yup.string()
    .trim()
    .required('Last name is required'),
  email: yup.string()
    .trim()
    .lowercase()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

export const validateUserField = (data, field) => {
  return validateField(data, field, schema);
};

export const validateUser = async (data) => {
  const result = await validate(data, schema);
  const isValid = isEmpty(result.errors);

  return {
    errors: result.errors,
    isValid,
  };
};
