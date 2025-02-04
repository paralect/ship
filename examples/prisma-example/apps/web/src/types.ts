export * from 'app-types';
export type { ApiError } from 'services/api.service';

export type QueryParam = string | string[] | undefined;

export type ListResult<T> = {
  results: T[];
  pagesCount: number;
  count: number;
};

export type SortOrder = 'asc' | 'desc';

export type SortParams<F> = {
  [P in keyof F]?: SortOrder;
};

export type ListParams<T, F> = {
  page?: number;
  perPage?: number;
  searchValue?: string;
  filter?: T;
  sort?: SortParams<F>;
};
