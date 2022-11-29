import { subscriptionTypes } from 'resources/subscription';

export interface User {
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
  isShadow: boolean | null;
  signupToken: string | null;
  resetPasswordToken?: string | null;
  avatarUrl?: string | null;
  subscription: subscriptionTypes.Subscription;
  lastRequest?: Date;
  oauth?: {
    google: boolean
  };
}
