import { Post } from '@prisma/client';

import {
  PaginationInput,
  PaginationOutput,
} from '@app/common/dtos/pagination.dto';

export class GetPostsByCategoryIdInput extends PaginationInput {
  categoryId: number;
}

export class GetPostsByCategoryIdOutput extends PaginationOutput {
  posts?: Post[];
  categoryName?: string;
}
