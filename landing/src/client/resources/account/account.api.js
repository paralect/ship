import { postRequest, putRequest } from '~/helpers/api/api.client';

export const buildUrl = url => `/account${url}`;

export const signup = params => postRequest(buildUrl('/signup'), params);
export const signin = params => postRequest(buildUrl('/signin'), params);
export const forgotPassword = params => postRequest(buildUrl('/forgotPassword'), params);
export const resetPassword = params => putRequest(buildUrl('/resetPassword'), params);
