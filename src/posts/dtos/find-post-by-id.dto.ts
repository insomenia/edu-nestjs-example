import { Post } from '@prisma/client';

export class FindPostByIdInput {
  postId: number;
}

export class FindPostByIdOutput {
  post?: Post;
  ok: boolean;
  error?: string;
}
