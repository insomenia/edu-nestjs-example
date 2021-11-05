import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
import {
  DeleteCategoryInput,
  DeleteCategoryOutput,
} from './dtos/delete-category.dto';
import {
  EditCategoryInput,
  EditCategoryOutput,
} from './dtos/edit-category.dto';
import { GetAllCategoriesOutput } from './dtos/get-all-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    //
    private readonly prisma: PrismaService,
  ) {}

  async getAllCategories(): Promise<GetAllCategoriesOutput> {
    try {
      const categories = await this.prisma.category.findMany();
      if (!categories) {
        return {
          ok: false,
          error: '카테고리를 불러올 수가 없습니다.',
        };
      }
      return {
        ok: true,
        categories,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: '카테고리를 불러올 수가 없습니다.',
      };
    }
  }

  async createCategory({
    name,
  }: CreateCategoryInput): Promise<CreateCategoryOutput> {
    try {
      const categoryName = name.trim().toLowerCase();

      const category = await this.prisma.category.findUnique({
        where: {
          name,
        },
      });

      if (category) {
        return {
          ok: false,
          error: '이미 해당 카테고리를 추가하셨습니다.',
        };
      }

      await this.prisma.category.create({
        data: {
          name,
        },
      });

      return {
        ok: true,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: '카테고리를 추가할 수 없습니다.',
      };
    }
  }

  async editCategory({
    name,
    categoryId,
  }: EditCategoryInput): Promise<EditCategoryOutput> {
    try {
      const categoryName = name.trim().toLowerCase();

      const category = await this.prisma.category.findUnique({
        where: {
          id: +categoryId,
        },
      });

      if (!category) {
        return {
          ok: false,
          error: '수정할 카테고리를 찾을 수가 없습니다.',
        };
      }

      console.log(categoryName);

      await this.prisma.category.update({
        where: {
          id: categoryId,
        },
        data: {
          name: categoryName,
        },
      });

      return {
        ok: true,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: '카테고리를 수정할 수 없습니다.',
      };
    }
  }

  async deleteCategory({
    categoryId,
  }: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        return {
          ok: false,
          error: '삭제할 카테고리를 찾을 수가 없습니다.',
        };
      }

      await this.prisma.category.delete({
        where: {
          id: categoryId,
        },
      });
      return {
        ok: true,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: '카테고리를 삭제할 수 없습니다.',
      };
    }
  }
}
