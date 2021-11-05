import { CoreOutput } from '@app/common/dtos/output.dto';

export class EditPostInput {
  postId: number;
  title?: string;
  content?: string;
  categoryName?: string;
}

export class EditPostOutput extends CoreOutput {}
