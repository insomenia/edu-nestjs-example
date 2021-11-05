export class EditPostInput {
  postId: number;
  title?: string;
  content?: string;
  categoryName?: string;
}

export class EditPostOutput {
  ok: boolean;
  error?: string;
}
