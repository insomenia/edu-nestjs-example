import { Category } from '@prisma/client';

export class GetAllCategoriesOutput {
  categories?: Category[];
  ok: boolean;
  error?: string;
}
