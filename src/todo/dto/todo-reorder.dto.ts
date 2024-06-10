import { IsNumber, Min } from 'class-validator';
import validation from 'src/common/validation-message';

export class TodoReorderDto {
  @Min(1, { message: validation.min })
  @IsNumber(undefined, { message: validation.number })
  order: number;
}
