export enum TokenType {
  ACCESS = 'access',
}

export type Token = {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date | null;
  type: TokenType;
  value: string;
  userId: string;
};
