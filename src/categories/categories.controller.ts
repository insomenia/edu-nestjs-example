import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { Roles } from '@auth/roles.decorator';
import { CategoriesService } from '@categories/categories.service';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
import { DeleteCategoryOutput } from '@categories/dtos/delete-category.dto';
import {
  EditCategoryInput,
  EditCategoryOutput,
} from '@categories/dtos/edit-category.dto';
import { GetAllCategoriesOutput } from '@categories/dtos/get-all-categories.dto';

@Controller('/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('')
  @Roles(['Any'])
  async getAllCategories(): Promise<GetAllCategoriesOutput> {
    return this.categoriesService.getAllCategories();
  }

  @Post('')
  @Roles(['ADMIN'])
  async createCategory(
    @Body() createCategoryInput: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    return this.categoriesService.createCategory(createCategoryInput);
  }

  @Put('/:categoryId')
  @Roles(['ADMIN'])
  async editCategory(
    @Body() body,
    @Param('categoryId') categoryId,
  ): Promise<EditCategoryOutput> {
    const editCategoryInput: EditCategoryInput = {
      ...body,
      categoryId: +categoryId,
    };
    return this.categoriesService.editCategory(editCategoryInput);
  }

  @Delete('/:categoryId')
  @Roles(['ADMIN'])
  async deleteCategory(
    @Param('categoryId') categoryId,
  ): Promise<DeleteCategoryOutput> {
    return this.categoriesService.deleteCategory({ categoryId: +categoryId });
  }
}
