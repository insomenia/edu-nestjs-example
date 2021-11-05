export type SortState = 'createdAt desc' | 'price desc' | 'price asc';

export type paginationObj = {
  totalData: number;
  takePages: number;
  page: number;
};
