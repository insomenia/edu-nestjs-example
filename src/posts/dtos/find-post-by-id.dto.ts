import { Post } from '@prisma/client';

import { CoreOutput } from '@app/common/dtos/output.dto';

export class FindPostByIdInput {
  postId: number;
}

export class FindPostByIdOutput extends CoreOutput {
  post?: Post;
}
