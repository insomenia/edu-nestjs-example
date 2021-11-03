import { Module } from '@nestjs/common';

import { PrismaService } from '@prisma/prisma.service';
import { UsersController } from '@users/users.controller';
import { UsersService } from '@users/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  imports: [PrismaService],
})
export class UsersModule {}
