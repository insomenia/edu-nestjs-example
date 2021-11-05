import { PrismaService } from '@app/prisma/prisma.service';
import { Module } from '@nestjs/common';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [PrismaService],
  providers: [PostsService, PrismaService],
  controllers: [PostsController],
})
export class PostsModule {}
