import { IsInt, IsString } from 'class-validator';

import { CoreOutput } from '@app/common/dtos/output.dto';

export class EditCategoryInput {
  @IsString()
  name: string;

  @IsInt()
  categoryId: number;
}

export class EditCategoryOutput extends CoreOutput {}
