import { Category } from '@prisma/client';

import { CoreOutput } from '@app/common/dtos/output.dto';

export class GetAllCategoriesOutput extends CoreOutput {
  categories?: Category[];
}
