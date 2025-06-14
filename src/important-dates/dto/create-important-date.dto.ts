import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateImportantDateDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  date: string;

  @IsArray()
  @IsString({ each: true })
  destination: string[];
}
