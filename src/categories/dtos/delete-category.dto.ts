import { IsInt } from 'class-validator';

import { CoreOutput } from '@app/common/dtos/output.dto';

export class DeleteCategoryInput {
  @IsInt()
  categoryId: number;
}

export class DeleteCategoryOutput extends CoreOutput {}
