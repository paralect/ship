export enum TokenType {
  ACCESS = 'access',
}

export type Token = {
  _id: string;
  createdOn?: string;
  updatedOn?: string;
  deletedOn?: string;
  type: TokenType;
  value: string;
  userId: string;
};
