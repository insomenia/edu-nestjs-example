import { Body, Controller, Post } from '@nestjs/common';
import { SignupInput, SignupOutput } from './dtos/signup.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  async signup(@Body() body): Promise<SignupOutput> {
    const singupInput: SignupInput = {
      ...body,
    };
    return this.usersService.signup(singupInput);
  }
}
