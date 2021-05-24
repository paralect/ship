import api from 'services/api.service';

export const signIn = ({
  email,
  password,
}) => {
  return api.post('/account/signin', {
    email,
    password,
  });
};

export const signUp = ({
  firstName,
  lastName,
  email,
  password,
}) => {
  return api.post('/account/signup', {
    firstName,
    lastName,
    email,
    password,
  });
};

export const forgot = ({ email }) => {
  return api.post('/account/forgot-password', { email });
};

export const reset = ({ password, token }) => {
  return api.put('/account/reset-password', { password, token });
};

export const signOut = () => {
  return api.post('/account/logout');
};

export const getCurrentUser = () => {
  return api.get('/users/current');
};

export const updateCurrentUser = (data) => {
  return api.put('/users/current', data);
};
