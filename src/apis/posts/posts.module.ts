import { PrismaService } from '@app/prisma/prisma.service';
import { Module } from '@nestjs/common';

import { PostsController } from '@posts/posts.controller';
import { PostsService } from '@posts/posts.service';

@Module({
  imports: [PrismaService],
  providers: [PostsService, PrismaService],
  controllers: [PostsController],
})
export class PostsModule {}
