import { IsNumber, IsOptional, IsString, Max } from 'class-validator';

import validation from '../../common/validation-message';

export class TodoUpdateDto {
  @IsString({ message: validation.string })
  @Max(255, { message: validation.max })
  @IsOptional()
  description?: string;

  @IsNumber(undefined, { message: validation.number })
  @IsOptional()
  order?: number;
}
