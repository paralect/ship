import React from 'react';
import cn from 'classnames';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';

import * as toastSelectors from 'resources/toast/toast.selectors';
import { toastActions } from 'resources/toast/toast.slice';

import Icon from 'components/icon';
import IconButton from 'components/icon-button';

import styles from './toast.styles.pcss';

function getIconProps(type) {
  switch (type) {
    case 'success':
      return {
        icon: 'roundCheck',
        color: '#FFF',
      };
    case 'warning':
      return {
        icon: 'roundWarning',
        color: '#000',
      };
    case 'error':
      return {
        icon: 'roundError',
        color: '#FFF',
      };
    case 'info':
      return {
        icon: 'roundInfo',
        color: '#FFF',
      };
    default:
      return {};
  }
}

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
        {messages.map((m) => {
          const closeToast = () => {
            dispatch(toastActions.remove({ id: m.id }));
          };

          const iconProps = getIconProps(m.type);
          return (
            <div
              key={m.id}
              className={cn(styles.toast, styles[m.type])}
            >
              <div className={styles.main}>
                <Icon
                  icon={iconProps.icon}
                  color={iconProps.color}
                  noWrapper
                />
                <span>{m.text}</span>
              </div>
              <IconButton
                icon="close"
                color={iconProps.color}
                onClick={closeToast}
              />
            </div>
          );
        })}
      </>
    );
  }

  return ReactDOM.createPortal(list(), element.current);
}

export const Toast = React.memo(RawToast);
