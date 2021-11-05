import { MinLength } from 'class-validator';

import { CoreOutput } from '@app/common/dtos/output.dto';

export class ChangePasswordInput {
  currentPassword: string;

  @MinLength(8)
  newPassword: string;

  @MinLength(8)
  verifyPassword: string;
}

export class ChangePasswordOutput extends CoreOutput {}
