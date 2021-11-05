import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { CreatePostInput, CreatePostOutput } from '@posts/dtos/create-post.dto';
import { DeletePostOutput } from '@posts/dtos/delete-post.dto';
import { EditPostInput, EditPostOutput } from '@posts/dtos/edit-post.dto';
import { FindPostByIdOutput } from '@posts/dtos/find-post-by-id.dto';
import {
  GetPostsByCategoryIdInput,
  GetPostsByCategoryIdOutput,
} from '@posts/dtos/get-posts-by-categoryId.dto';
import { PostsService } from '@posts/posts.service';
import { Roles } from '@app/auth/roles.decorator';
import { AuthUser } from '@app/auth/auth-user.decorator';

@Controller('/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/:postId')
  @Roles(['Any'])
  async findPostById(@Param('postId') postId): Promise<FindPostByIdOutput> {
    return this.postsService.findPostById({ postId: +postId });
  }

  @Get('')
  @Roles(['Any'])
  async getPostsByCategoryId(
    @Query('categoryId') categoryId: string,
    @Query('page') page: string,
  ): Promise<GetPostsByCategoryIdOutput> {
    const getPostsByCategoryIdInput: GetPostsByCategoryIdInput = {
      categoryId: +categoryId,
      page: +page,
    };
    return this.postsService.getPostsByCategoryId(getPostsByCategoryIdInput);
  }

  @Post('')
  @Roles(['USER', 'ADMIN'])
  async createPost(
    @Body() createPostInput: CreatePostInput,
    @AuthUser() provider: User,
  ): Promise<CreatePostOutput> {
    return this.postsService.createPost(createPostInput, provider);
  }

  @Put('/:postId')
  @Roles(['USER', 'ADMIN'])
  async editPost(
    @Param('postId') postId,
    @Body() body,
    @AuthUser() provider: User,
  ): Promise<EditPostOutput> {
    const editPostInput: EditPostInput = {
      ...body,
      postId: +postId,
    };
    return this.postsService.editPost(editPostInput, provider);
  }

  @Delete('/:postId')
  @Roles(['USER', 'ADMIN'])
  async deletePost(
    @Param('postId') postId,
    @AuthUser() provider: User,
  ): Promise<DeletePostOutput> {
    return this.postsService.deletePost({ postId: +postId }, provider);
  }
}
