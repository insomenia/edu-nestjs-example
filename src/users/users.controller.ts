import { User } from '@prisma/client';
import { AuthUser } from '@app/auth/auth-user.decorator';
import { Roles } from '@app/auth/roles.decorator';
import { Body, Controller, Get, Post } from '@nestjs/common';

import { SignupInput, SignupOutput } from '@users/dtos/signup.dto';
import { UsersService } from '@users/users.service';
import { LoginInput, LoginOutput } from './dtos/login.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  @Roles(['Any'])
  me(@AuthUser() user: User): User {
    return user;
  }

  @Post('/signup')
  async signup(@Body() body): Promise<SignupOutput> {
    const singupInput: SignupInput = {
      ...body,
    };
    return this.usersService.signup(singupInput);
  }

  @Post('/login')
  async login(
    @Body() body, //
  ): Promise<LoginOutput> {
    const loginInput: LoginInput = {
      ...body,
    };
    return this.usersService.login(loginInput);
  }
}
