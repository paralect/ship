import { render, unmountComponentAtNode } from 'react-dom';

const DEFAULT_DESTRUCTION_DELAY = 300;

const noop = () => {};

const createConfirmation = (Component, destructionDelay) => (props) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const displayModal = ({ onSubmit, onDismiss }) => {
    render(
      <Component
        onSubmit={onSubmit}
        onDismiss={onDismiss}
        isOpen
        {...props}
      />,
      container,
    );
  };

  const hideModal = ({ onSubmit, onDismiss }, callback) => {
    render(
      <Component
        onSubmit={onSubmit}
        onDismiss={onDismiss}
        isOpen={false}
        {...props}
      />,
      container,
      callback,
    );
  };

  const destroyModal = () => {
    unmountComponentAtNode(container);
    document.body.removeChild(container);
  };

  const confirmation = new Promise((resolve) => {
    const onSubmit = (value = true) => resolve(value);
    const onDismiss = () => resolve(false);
    displayModal({ onSubmit, onDismiss });
  });

  return confirmation.finally(() => {
    const onSubmit = noop;
    const onDismiss = noop;
    hideModal({ onSubmit, onDismiss }, () => {
      setTimeout(destroyModal, destructionDelay || DEFAULT_DESTRUCTION_DELAY);
    });
  });
};

export default createConfirmation;
