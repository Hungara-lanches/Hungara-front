export interface IPageReq<T> {
  data: T[];
  count: number;
  currentPage: number;
  hasNextPage: null;
  hasPrevPage: null;
}
