export interface SignInVariables {
  email: string;
  password: string;
}

export interface SignUpVariables {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  signupToken: string;
}

export interface ForgotPasswordVariables {
  email: string;
}

export interface ResetPasswordVariables {
  token: string;
  password: string;
}

export interface ResendEmailVariables {
  email: string;
}
