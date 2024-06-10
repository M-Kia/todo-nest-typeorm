import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import validation from 'src/common/validation-message';

export class TodoChangeColumnDto {
  @IsNumber(undefined, { each: true, message: validation.number })
  @IsArray({ message: validation.array })
  @IsNotEmpty({ message: validation.not_empty })
  todo_ids: number[];

  @IsNumber(undefined, { message: validation.number })
  @IsNotEmpty({ message: validation.not_empty })
  column_id: number;
}
