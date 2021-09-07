import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { toastActions } from 'resources/toast/toast.slice';

import styles from './form.styles.pcss';

const Form = ({
  defaultValues,
  className,
  children,
  onSubmit,
  validationSchema,
}) => {
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: validationSchema && yupResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  const { handleSubmit, setError, clearErrors } = methods;

  const submitHandler = useCallback(async (values) => {
    try {
      await onSubmit(values);
      clearErrors();
    } catch ({ data }) {
      const { errors: { _global, ...validationErrors } } = data;
      if (_global) dispatch(toastActions.error(_global));
      if (setError && validationErrors) {
        Object.keys(validationErrors).forEach((key) => {
          setError(key, { message: validationErrors[key].join(' ') }, { shouldFocus: true });
        });
      }
    }
  }, [onSubmit, clearErrors, dispatch, setError]);

  return (
    <FormProvider
      {...methods}
      className={classnames(styles.form, className)}
    >
      <form
        onSubmit={handleSubmit(submitHandler)}
      >
        {children}
      </form>
    </FormProvider>
  );
};

Form.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  defaultValues: PropTypes.shape({}),
  validationSchema: PropTypes.shape({}),
  onSubmit: PropTypes.func.isRequired,
};

Form.defaultProps = {
  className: '',
  defaultValues: null,
  validationSchema: null,
};

export default Form;
