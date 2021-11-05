import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { CreatePostInput, CreatePostOutput } from '@posts/dtos/create-post.dto';
import { EditPostInput, EditPostOutput } from '@posts/dtos/edit-post.dto';
import { DeletePostInput, DeletePostOutput } from '@posts/dtos/delete-post.dto';
import {
  FindPostByIdInput,
  FindPostByIdOutput,
} from '@posts/dtos/find-post-by-id.dto';
import {
  GetPostsByCategoryIdInput,
  GetPostsByCategoryIdOutput,
} from '@posts/dtos/get-posts-by-categoryId.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { createPaginationObj } from '@app/utils';

@Injectable()
export class PostsService {
  constructor(
    //
    private readonly prisma: PrismaService,
  ) {}

  async findPostById({
    postId,
  }: FindPostByIdInput): Promise<FindPostByIdOutput> {
    try {
      const post = await this.prisma.post.findFirst({
        where: {
          id: postId,
        },
      });

      return {
        ok: true,
        post,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: '포스팅을 가져올 수 없습니다.',
      };
    }
  }

  async getPostsByCategoryId({
    categoryId,
    page = 1,
  }: GetPostsByCategoryIdInput): Promise<GetPostsByCategoryIdOutput> {
    try {
      const takePages = 10;
      const category = await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        return {
          ok: false,
          error: '해당 카테고리가 존재하지 않습니다.',
        };
      }

      const posts = await this.prisma.post.findMany({
        where: {
          category,
        },
        skip: (page - 1) * takePages,
        take: takePages,
        include: {
          author: true,
          category: true,
        },
      });

      const totalPosts = posts.length;

      const paginationObj = createPaginationObj({
        takePages,
        page,
        totalData: totalPosts,
      });

      return {
        ok: true,
        posts,
        categoryName: category.name,
        ...paginationObj,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: '카테고리에 있는 포스팅을 불러올 수 없습니다.',
      };
    }
  }

  async createPost(
    createPostInput: CreatePostInput,
    author: User,
  ): Promise<CreatePostOutput> {
    try {
      const category = await this.prisma.category.findFirst({
        where: {
          name: createPostInput.categoryName,
        },
      });

      const newPost = await this.prisma.post.create({
        data: {
          title: createPostInput.title,
          content: createPostInput.content,
          author: {
            connect: {
              id: author.id,
            },
          },
          category: {
            connect: {
              id: category.id,
            },
          },
        },
      });

      return {
        ok: true,
        post: newPost,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: '포스팅을 추가할 수 없습니다.',
      };
    }
  }

  async editPost(
    editPostInput: EditPostInput,
    author: User,
  ): Promise<EditPostOutput> {
    try {
      const post = await this.prisma.post.findFirst({
        where: {
          id: editPostInput.postId,
          authorId: author.id,
        },
        select: {
          category: true,
        },
      });

      let category = post.category;

      if (!post) {
        return {
          ok: false,
          error: '수정하시려는 포스팅이 없습니다.',
        };
      }

      if (editPostInput.categoryName) {
        category = await this.prisma.category.findFirst({
          where: {
            name: editPostInput.categoryName,
          },
        });
      }

      await this.prisma.post.update({
        where: {
          id: editPostInput.postId,
        },
        data: {
          title: editPostInput.title,
          content: editPostInput.content,
          author: {
            connect: {
              id: author.id,
            },
          },
          category: {
            connect: {
              id: category.id,
            },
          },
        },
      });

      return {
        ok: true,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: '포스팅을 수정할 수 없습니다.',
      };
    }
  }

  async deletePost(
    { postId }: DeletePostInput,
    author: User,
  ): Promise<DeletePostOutput> {
    try {
      const post = await this.prisma.post.findFirst({
        where: {
          id: postId,
          authorId: author.id,
        },
        select: {
          author: true,
        },
      });

      if (!post) {
        return {
          ok: false,
          error: '삭제하시려는 포스팅을 찾을 수가 없습니다.',
        };
      }

      await this.prisma.post.delete({
        where: {
          id: postId,
        },
      });

      return {
        ok: true,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: '포스팅을 삭제할 수가 없습니다.',
      };
    }
  }
}
