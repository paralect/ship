export type Invite = {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
  email: string;
  token: string;
  invitedBy: string;
};
