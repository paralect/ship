import React from 'react';
import cn from 'classnames';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';

import * as toastSelectors from 'resources/toast/toast.selectors';
import { toastActions } from 'resources/toast/toast.slice';

import styles from './toast.pcss';

function RawToast() {
  const dispatch = useDispatch();

  const messages = useSelector(toastSelectors.selectMessages);

  const element = React.useRef(document.createElement('div'));

  React.useEffect(() => {
    const node = element.current;

    node.classList.add(styles.container);
    document.body.appendChild(node);

    return () => document.body.removeChild(node);
  }, []);

  function list() {
    return (
      <>
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(styles.toast, styles[m.type])}
          >
            <span>{m.text}</span>
            <button
              type="button"
              className={styles.cross}
              onClick={() => dispatch(toastActions.remove({ id: m.id }))}
            >
              x
            </button>
          </div>
        ))}
      </>
    );
  }

  return ReactDOM.createPortal(list(), element.current);
}

export const Toast = React.memo(RawToast);
