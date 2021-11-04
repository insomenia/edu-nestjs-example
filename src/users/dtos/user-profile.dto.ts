import { User } from '@prisma/client';

export class UserProfileInput {
  userId: number;
}

export class UserProfileOutput {
  ok: boolean;
  error?: string;
  user?: User;
}
