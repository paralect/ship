import api from 'services/api.service';

export const signUp = (data) => api.post('/account/sign-up', data);
export const signIn = (data) => api.post('/account/sign-in', data);
export const signOut = () => api.post('/account/sign-out');
export const forgotPassword = (data) => api.post('/account/forgot-password', data);
export const resetPassword = (data) => api.put('/account/reset-password', data);
export const resendEmail = (data) => api.post('/account/resend-email', data);

export const getCurrent = () => api.get('/users/current');
export const updateCurrent = (data) => api.post('/users/current', data);
export const uploadProfilePhoto = (data) => api.post('/users/upload-photo', data);
export const removeProfilePhoto = () => api.delete('/users/remove-photo');

export const list = (data) => api.get('/users', data);
