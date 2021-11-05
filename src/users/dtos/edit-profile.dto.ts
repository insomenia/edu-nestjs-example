import { IsEmail, IsString } from 'class-validator';

import { CoreOutput } from '@app/common/dtos/output.dto';

export class EditProfileInput {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  avatar: string | null;

  @IsString()
  bio: string;
}

export class EditProfileOutput extends CoreOutput {}
