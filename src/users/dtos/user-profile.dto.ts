import { User } from '@prisma/client';

import { CoreOutput } from '@app/common/dtos/output.dto';

export class UserProfileInput {
  userId: number;
}

export class UserProfileOutput extends CoreOutput {
  user?: User;
}
