import { Injectable } from '@nestjs/common';

import { CreatePostInput, CreatePostOutput } from './dtos/create-post.dto';
import { EditPostInput, EditPostOutput } from './dtos/edit-post.dto';
import { DeletePostInput, DeletePostOutput } from './dtos/delete-post.dto';
import {
  FindPostByIdInput,
  FindPostByIdOutput,
} from './dtos/find-post-by-id.dto';
import {
  GetPostsBySearchTermInput,
  GetPostsBySearchTermOutput,
} from './dtos/get-post-by-name.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { createPaginationObj } from '@app/utils';
import { User } from '.prisma/client';

@Injectable()
export class PostsService {
  constructor(
    //
    private readonly prisma: PrismaService,
  ) {}

  async getPostsBySearchTerm({
    page,
    query,
    sort = 'createdAt desc',
  }: GetPostsBySearchTermInput): Promise<GetPostsBySearchTermOutput> {
    try {
      const takePages = 10;
      let orderBy = {};
      switch (sort) {
        case 'createdAt desc':
          orderBy = {
            createdAt: 'DESC',
          };
          break;
        case 'price desc':
          orderBy = {
            price: 'DESC',
          };
          break;
        case 'price asc':
          orderBy = {
            price: 'ASC',
          };
          break;
        default:
          throw new Error('상품이 존재하지 않습니다.');
      }

      const posts = await this.prisma.post.findMany({
        where: {
          // RAW : raw sql query를 실행할 수 있도록 해준다.
          // %${query}%는 query가 포함된 값을 찾아준다.
          title: {
            mode: 'insensitive',
          },
        },
        skip: (page - 1) * takePages,
        take: takePages,
        orderBy,
        include: {
          author: true,
          category: true,
        },
      });

      const totalPosts = posts.length;
      console.log(totalPosts);

      const paginationObj = createPaginationObj({
        takePages,
        page,
        totalData: totalPosts,
      });

      return {
        ok: true,
        posts,
        ...paginationObj,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: '상품 품목들을 가져올 수 없습니다.',
      };

      // return {
      //   ok: false,
      //   errorObj: new Error(error),
      // };
    }
  }

  async findPostById({
    postId,
  }: FindPostByIdInput): Promise<FindPostByIdOutput> {
    // todo
    // category 내역에 있는 품목만 가져오는 것으로 만들기
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
        error: '상품 품목들을 가져올 수 없습니다.',
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
          ...createPostInput,
          author: {
            create: author,
          },
          category: {
            create: category,
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
        error: '상품을 추가할 수 없습니다.',
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
          author,
        },
        select: {
          category: true,
        },
      });

      let category = post.category;

      if (!post) {
        return {
          ok: false,
          error: '수정하시려는 상품이 없습니다.',
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
          ...editPostInput,
          category: {
            update: category,
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
        error: '상품을 수정할 수 없습니다.',
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
        },
        select: {
          author: true,
        },
      });

      if (!post) {
        return {
          ok: false,
          error: '삭제하시려는 상품을 찾을 수가 없습니다.',
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
        error: '상품을 삭제할 수가 없습니다.',
      };
    }
  }
}
