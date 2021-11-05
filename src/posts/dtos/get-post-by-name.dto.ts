import { SortState } from '@app/common';
import { Post } from '@prisma/client';

export class GetPostsBySearchTermInput {
  query: string;
  sort?: SortState;
  page?: number;
}

export class GetPostsBySearchTermOutput {
  posts?: Post[];
  totalPages?: number;
  totalResults?: number;
  prevtPage?: number;
  hasPrevtPage?: boolean;
  nextPage?: number;
  hasNextPage?: boolean;
  ok: boolean;
  error?: string;
}
