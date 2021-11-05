import { Post } from '@prisma/client';

export class CreatePostInput {
  title: string;
  content: string;
  categoryName: string;
}

export class CreatePostOutput {
  post?: Post;
  ok: boolean;
  error?: string;
}
