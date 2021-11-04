import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  async checkPassowrd(user: User, password: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(password, user.password);
      return ok;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
