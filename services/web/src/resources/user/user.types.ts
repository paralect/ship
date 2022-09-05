import { UserDto } from 'types';

export interface UpdateCurrentVariables {
  email?: string;
  password?: string;
}

export interface UsersListParams {
  page?: number;
  perPage?: number;
  searchValue?: string;
  sort?: {
    createdOn: number;
  };
}

export interface UserListResponse {
  count: number;
  items: UserDto[];
  totalPages: number;
}
