export class EditPostInput {
  postId: number;
  categoryName: string;
}

export class EditPostOutput {
  ok: boolean;
  error?: string;
}
