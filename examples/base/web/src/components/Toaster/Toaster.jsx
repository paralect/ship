import { memo } from 'react';
import { ToastContainer } from 'react-toastify';

import { CloseIcon } from 'public/icons';

import 'react-toastify/dist/ReactToastify.min.css';

const Toaster = () => (
  <ToastContainer
    hideProgressBar
    closeButton={() => <CloseIcon />}
  />
);

export default memo(Toaster);
