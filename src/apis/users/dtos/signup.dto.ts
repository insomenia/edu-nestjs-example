import { UserRole } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';

import { CoreOutput } from '@app/common/dtos/output.dto';

export class SignupInput {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(8)
  verifyPassword: string;

  @IsString()
  avatar: string | null;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  bio: string;

  @IsBoolean()
  verified: boolean;
}

export class SignupOutput extends CoreOutput {}
