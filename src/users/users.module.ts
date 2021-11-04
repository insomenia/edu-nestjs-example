import { AuthService } from '@app/auth/auth.service';
import { Module } from '@nestjs/common';

import { PrismaService } from '@prisma/prisma.service';
import { UsersController } from '@users/users.controller';
import { UsersService } from '@users/users.service';

@Module({
  imports: [PrismaService, AuthService],
  providers: [UsersService, PrismaService, AuthService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
