import { Post } from '@prisma/client';

import { CoreOutput } from '@app/common/dtos/output.dto';

export class CreatePostInput {
  title: string;
  content: string;
  categoryName: string;
}

export class CreatePostOutput extends CoreOutput {
  post?: Post;
}
