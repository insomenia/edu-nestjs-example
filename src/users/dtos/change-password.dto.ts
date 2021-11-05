import { MinLength } from 'class-validator';

export class ChangePasswordInput {
  currentPassword: string;

  @MinLength(8)
  newPassword: string;

  @MinLength(8)
  verifyPassword: string;
}

export class ChangePasswordOutput {
  ok: boolean;
  error?: string;
}
