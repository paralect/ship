export type User = {
  _id: string;
  createdOn?: string;
  updatedOn?: string;
  deletedOn?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  signupToken: string | null;
  resetPasswordToken?: string | null;
  avatarUrl?: string | null;
  lastRequest?: string;
};
