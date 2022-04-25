export type User = {
  _id: string;
  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  passwordHash: string;
  resetPasswordToken: string | null;
  isEmailVerified?: boolean;
  signupToken?: string | null;
};
