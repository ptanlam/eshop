export interface ListResponse<T> {
  data: Array<T>;
  pagination: {
    total: number;
  };
}
