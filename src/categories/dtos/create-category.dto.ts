import { IsString } from 'class-validator';

export class CreateCategoryInput {
  @IsString()
  name: string;
}

export class CreateCategoryOutput {
  ok: boolean;
  error?: string;
}
