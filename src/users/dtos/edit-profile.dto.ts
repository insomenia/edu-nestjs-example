import { IsEmail, IsString } from 'class-validator';

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

export class EditProfileOutput {}
