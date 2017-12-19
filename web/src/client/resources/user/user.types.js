// @flow

export type StateType = {
  _id: string,
  createdOn: Date,
  firstName: string,
  lastName: string,
  email: string,
};

export type ActionType = {
  type: string,
  payload: StateType,
};

export type ReducerType = (state: StateType, action: ActionType) => StateType;
