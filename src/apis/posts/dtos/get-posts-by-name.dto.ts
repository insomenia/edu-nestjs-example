import { Post } from '@prisma/client';

import {
  PaginationInput,
  PaginationOutput,
} from '@app/common/dtos/pagination.dto';

export class GetPostsBySearchTermInput extends PaginationInput {
  categoryId?: number;
}

export class GetPostsBySearchTermOutput extends PaginationOutput {
  posts?: Post[];
}
