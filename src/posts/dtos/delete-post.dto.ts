import { CoreOutput } from '@app/common/dtos/output.dto';

export class DeletePostInput {
  postId: number;
}

export class DeletePostOutput extends CoreOutput {}
