import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TOKEN_KEY } from '@common/common.constants';
import { JwtService } from '@jwt/jwt.service';
import { UsersService } from '@users/users.service';
import { AllowedRoles } from '@auth/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<AllowedRoles[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    let token: string = null;

    if (context?.getType() === 'http') {
      const req = context.getArgByIndex(0);
      if (req.headers.hasOwnProperty(TOKEN_KEY)) {
        const authorization = req.headers[TOKEN_KEY];
        if (authorization.includes('Bearer')) {
          token = authorization.split(' ')[1];
        }
      }
    }

    if (token) {
      const decoded = this.jwtService.verify(token);
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { ok, user } = await this.usersService.findUserById(
          +decoded['id'],
        );
        if (ok) {
          const request = context.switchToHttp().getRequest();
          request['user'] = user;

          if (roles.includes('Any')) {
            return true;
          }
          return roles.includes(user.role);
        }
      }
    }

    if (roles.includes('Any')) {
      return true;
    }

    return false;
  }
}
