/* eslint-disable react/prop-types */
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

const InputController = ({ children, name, ...props }) => {
  const formContext = useFormContext();
  return (
    <Controller
      control={formContext.control}
      name={name}
      render={({
        field: { onChange, value },
      }) => React.cloneElement(children, {
        ...props, onChange, name, value,
      })}
    />

  );
};

export default React.memo(InputController);
