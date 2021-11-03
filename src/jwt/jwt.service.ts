import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { CONFIG_OPTIONS } from '@app/common/common.constants';
import { JwtModuleOptions } from '@jwt/jwt';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}

  sign(userId: string): string {
    return jwt.sign({ id: userId }, this.options.privateKey, {
      algorithm: 'RS256',
    });
  }

  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}
