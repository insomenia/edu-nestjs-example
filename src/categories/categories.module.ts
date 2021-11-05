import { Module } from '@nestjs/common';

import { CategoriesService } from '@categories/categories.service';
import { CategoriesController } from '@categories/categories.controller';
import { PrismaService } from '@app/prisma/prisma.service';

@Module({
  imports: [PrismaService],
  providers: [CategoriesService, PrismaService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
