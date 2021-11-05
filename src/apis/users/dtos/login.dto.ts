import { IsEmail, IsString, MinLength } from 'class-validator';

import { CoreOutput } from '@app/common/dtos/output.dto';

export class LoginInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginOutput extends CoreOutput {
  token?: string;
}
