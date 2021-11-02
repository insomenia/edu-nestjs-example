import { UserRole } from '@prisma/client';

export class SignupInput {
  email: string;
  username: string;
  password: string;
  avatar: string | null;
  role: UserRole;
  bio: string;
  verified: boolean;
  verifyPassword: string;
}

export class SignupOutput {
  ok: boolean;
  error?: string;
}
