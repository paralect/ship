import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { toastActions, toastSelectors } from 'resources/toast/toast.slice';

import Toast from 'components/Toast';

import styles from './ToastProvider.module.css';

const ToasterProvider = () => {
  const dispatch = useDispatch();
  const messages = useSelector(toastSelectors.selectMessages);

  const onClose = useCallback((id) => {
    dispatch(toastActions.removeToast({ id }));
  }, [dispatch]);

  return (
    <div className={styles.toasterProvider}>
      {messages.map((e) => (
        <Toast
          key={e.id}
          type={e.type}
          message={e.text}
          duration={e.duration}
          onClose={() => onClose(e.id)}
        />
      ))}
    </div>
  );
};

export default memo(ToasterProvider);
