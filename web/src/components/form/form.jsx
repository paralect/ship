import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import styles from './form.styles.pcss';

const Form = ({
  defaultValues,
  className,
  children,
  onSubmit,
  validationSchema,
}) => {
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
      const { errors: validationErrors } = data;
      if (validationErrors) {
        Object.keys(validationErrors).forEach((key) => {
          setError(key, { message: validationErrors[key].join(' ') }, { shouldFocus: true });
        });
      }
    }
  }, [onSubmit, clearErrors, setError]);

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
