import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import validation from 'src/common/validation-message';

export class UserUpdateDto {
  @MinLength(5, { message: validation.min })
  @MaxLength(255, { message: validation.max })
  @IsString({ message: validation.string })
  @IsEmail(null, { message: validation.email })
  @IsOptional()
  email: string;

  @MinLength(6, { message: validation.min })
  @MaxLength(32, { message: validation.max })
  @IsString({ message: validation.string })
  @IsOptional()
  password: string;
}
