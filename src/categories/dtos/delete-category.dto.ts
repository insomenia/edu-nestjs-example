import { IsInt } from 'class-validator';

export class DeleteCategoryInput {
  @IsInt()
  categoryId: number;
}

export class DeleteCategoryOutput {
  ok: boolean;
  error?: string;
}
