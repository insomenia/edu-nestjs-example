import { IsString } from 'class-validator';

import { CoreOutput } from '@app/common/dtos/output.dto';

export class CreateCategoryInput {
  @IsString()
  name: string;
}

export class CreateCategoryOutput extends CoreOutput {}
