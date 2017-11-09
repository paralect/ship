import { postRequest } from '~/helpers/api/api.client';

export const buildUrl = url => `/account${url}`;

export const signup = params => postRequest(buildUrl('/signup'), params);
export const signin = params => postRequest(buildUrl('/signin'), params);
