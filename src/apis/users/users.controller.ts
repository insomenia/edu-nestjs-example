import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from '@app/auth/auth-user.decorator';
import { Roles } from '@app/auth/roles.decorator';

import { SignupInput, SignupOutput } from '@users/dtos/signup.dto';
import { UsersService } from '@users/users.service';
import { LoginInput, LoginOutput } from '@users/dtos/login.dto';
import {
  EditProfileInput,
  EditProfileOutput,
} from '@users/dtos/edit-profile.dto';
import {
  ChangePasswordInput,
  ChangePasswordOutput,
} from '@users/dtos/change-password.dto';
import { UserProfileOutput } from '@users/dtos/user-profile.dto';

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

  @Post('/edit-profile')
  @Roles(['Any'])
  async editProfile(
    @Body() body,
    @AuthUser() user: User,
  ): Promise<EditProfileOutput> {
    const editProfileInput: EditProfileInput = {
      ...body,
    };
    return this.usersService.editProfile(editProfileInput, user);
  }

  @Post('/change-password')
  @Roles(['Any'])
  async changePassword(
    @Body() body,
    @AuthUser() user: User,
  ): Promise<ChangePasswordOutput> {
    const changePasswordOutput: ChangePasswordInput = {
      ...body,
    };
    return this.usersService.changePassword(changePasswordOutput, user);
  }

  @Get('/user-profile')
  @Roles(['Any'])
  async userProfile(@AuthUser() user: User): Promise<UserProfileOutput> {
    return this.usersService.findUserById(user.id);
  }
}
