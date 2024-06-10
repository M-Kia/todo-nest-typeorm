import { IsNumber, IsOptional, IsString, Max } from 'class-validator';

import validation from '../../../src/common/validation-message';

export class TodoCreateDto {
  @IsString({ message: validation.string })
  @Max(255, { message: validation.max })
  description: string;

  @IsNumber(undefined, { message: validation.number })
  @IsOptional()
  order?: number;

  @IsNumber(undefined, { message: validation.number })
  column_id: number;
}
