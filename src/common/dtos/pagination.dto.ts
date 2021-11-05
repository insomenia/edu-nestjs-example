import { CoreOutput } from './output.dto';

export class PaginationInput {
  page?: number;
}

export class PaginationOutput extends CoreOutput {
  totalPages?: number;
  totalResults?: number;
  prevtPage?: number;
  hasPrevtPage?: boolean;
  nextPage?: number;
  hasNextPage?: boolean;
}
