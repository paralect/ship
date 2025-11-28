import { User } from 'types';

export interface UserCardField {
  label: string;
  key: keyof User;
}
