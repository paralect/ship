// @flow

export type UserType = {
  _id: string,
  createdOn: Date,
  firstName: string,
  lastName: string,
  email: string,
};

export type ActionType = {
  type: string,
  payload: UserType,
};
