import { TSortQuery } from '../../components/filter/filter.types';

export type TPageState = {
  loading: boolean;
  currPage: number;
  pageSize: number;
  totalContent: number;
};

export type TPageFilter = { search: string; sort: TSortQuery };
