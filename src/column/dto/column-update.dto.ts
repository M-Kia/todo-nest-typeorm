import { IsBoolean, IsOptional, IsString, Max } from 'class-validator';
import validation from 'src/common/validation-message';

export class ColumnUpdateDto {
  @IsString({ message: validation.string })
  @Max(150, { message: validation.max })
  @IsOptional()
  title?: string;

  @IsBoolean({ message: validation.boolean })
  @IsOptional()
  hasSendMail?: boolean;
}
