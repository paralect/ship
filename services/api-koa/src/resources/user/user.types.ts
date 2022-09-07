export type User = {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  signupToken: string | null;
  resetPasswordToken?: string | null;
  avatarUrl?: string | null;
  lastRequest?: Date;
};
