import { Post } from '@prisma/client';

export class GetPostsByCategoryIdInput {
  categoryId: number;
  page?: number;
}

export class GetPostsByCategoryIdOutput {
  posts?: Post[];
  categoryName?: string;
  totalPages?: number;
  totalResults?: number;
  prevtPage?: number;
  hasPrevtPage?: boolean;
  nextPage?: number;
  hasNextPage?: boolean;
  ok: boolean;
  error?: string;
}
