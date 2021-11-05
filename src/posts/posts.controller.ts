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

import { CreatePostInput, CreatePostOutput } from './dtos/create-post.dto';
import { DeletePostOutput } from './dtos/delete-post.dto';
import { EditPostInput, EditPostOutput } from './dtos/edit-post.dto';
import { FindPostByIdOutput } from './dtos/find-post-by-id.dto';
import { PostsService } from './posts.service';

import { Roles } from '@app/auth/roles.decorator';
import { SortState } from '@app/common';
import { AuthUser } from '@app/auth/auth-user.decorator';
import {
  GetPostsBySearchTermInput,
  GetPostsBySearchTermOutput,
} from './dtos/get-post-by-name.dto';

@Controller('/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/')
  @Roles(['Any'])
  async getPostsBySearchTerm(
    @Query('page') page, //
    @Query('query') query,
    @Query('sort') sort: SortState,
  ): Promise<GetPostsBySearchTermOutput> {
    const getPostsBySearchTermInput: GetPostsBySearchTermInput = {
      page,
      query,
      sort,
    };
    return this.postsService.getPostsBySearchTerm(getPostsBySearchTermInput);
  }

  @Get('/:postId')
  @Roles(['Any'])
  async findPostById(@Param('postId') postId): Promise<FindPostByIdOutput> {
    return this.postsService.findPostById({ postId });
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
      postId,
    };
    return this.postsService.editPost(editPostInput, provider);
  }

  @Delete('/:postId')
  @Roles(['USER', 'ADMIN'])
  async deletePost(
    @Param('postId') postId,
    @AuthUser() provider: User,
  ): Promise<DeletePostOutput> {
    return this.postsService.deletePost({ postId }, provider);
  }
}
