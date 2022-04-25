export enum TokenType {
  ACCESS = 'access',
}

export type Token = {
  _id: string;
  createdOn: Date;
  updatedOn: Date;
  deletedOn?: Date;
  type?: TokenType;
  value?: string;
  userId: string | null;
};
