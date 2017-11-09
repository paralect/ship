import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

const Button = ({
  className,
  isLoading,
  action,
  children,
}) => {
  return (
    <button
      action={action}
      className={classNames(className, {
        loading: isLoading,
      })}
      disabled={isLoading}
    >
      <style jsx>{`
        button {
          transition: 0.5s;
          border-radius: 5px;
          cursor: pointer;
          color: white;
          padding: 15px 10px;
          width: 100%;

          &[disabled] {
            cursor: default;
          }

          &.loading {
            animation: Gradient 1s ease-in-out infinite;
            background-position: right center;
            opacity: .8;
          }
        }`}

      </style>
      {children}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  action: PropTypes.string,
  children: PropTypes.node,
};

Button.defaultProps = {
  className: '',
  isLoading: false,
  action: 'button',
  children: null,
};

export default Button;
