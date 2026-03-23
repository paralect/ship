// User type is inferred from the oRPC router
import type { orpc } from 'services/api-client.service';

export type User = Awaited<ReturnType<typeof orpc.account.get>>;

export type QueryParam = string | string[] | undefined;

export type SortOrder = 'asc' | 'desc';

export type SortParams<F> = {
  [P in keyof F]?: SortOrder;
};

export interface ListParams<T, F> {
  page?: number;
  perPage?: number;
  searchValue?: string;
  filter?: T;
  sort?: SortParams<F>;
}

export interface ListResult<T> {
  results: T[];
  pagesCount: number;
  count: number;
}
