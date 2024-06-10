import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
} from 'class-validator';
import validation from 'src/common/validation-message';

export class ColumnCreateDto {
  @IsString({ message: validation.string })
  @IsNotEmpty({ message: validation.not_empty })
  @Max(150, { message: validation.max })
  title: string;

  @IsBoolean({ message: validation.boolean })
  @IsOptional()
  hasSendMail?: boolean;
}
