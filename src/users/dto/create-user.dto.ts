import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { EnumUserType } from '../enums/EnumUserType';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(EnumUserType)
  @IsNotEmpty()
  role: EnumUserType;
}
