export type Invite = {
  _id: string;
  createdOn?: string;
  updatedOn?: string;
  deletedOn?: string;
  email: string;
  token: string;
  invitedBy: string;
};
