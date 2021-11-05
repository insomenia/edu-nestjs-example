import { Module } from '@nestjs/common';

import { CategoriesService } from '@app/apis/categories/categories.service';
import { CategoriesController } from '@app/apis/categories/categories.controller';
import { PrismaService } from '@app/prisma/prisma.service';

@Module({
  imports: [PrismaService],
  providers: [CategoriesService, PrismaService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
