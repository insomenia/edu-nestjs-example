import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginOutput {
  ok: boolean;
  error?: string;
  token?: string;
}
