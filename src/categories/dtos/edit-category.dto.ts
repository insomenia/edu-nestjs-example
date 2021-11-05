import { IsInt, IsString } from 'class-validator';

export class EditCategoryInput {
  @IsString()
  name: string;

  @IsInt()
  categoryId: number;
}

export class EditCategoryOutput {
  ok: boolean;
  error?: string;
}
