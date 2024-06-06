import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import validation from 'src/common/validation-message';

export class UserSignupDto {
  @MinLength(5, { message: validation.min })
  @MaxLength(255, { message: validation.max })
  @IsString({ message: validation.string })
  @IsEmail(undefined, { message: validation.email })
  @IsNotEmpty({ message: validation.not_empty })
  email: string;

  @MinLength(6, { message: validation.min })
  @MaxLength(32, { message: validation.max })
  @IsString({ message: validation.string })
  @IsNotEmpty({ message: validation.not_empty })
  password: string;
}
