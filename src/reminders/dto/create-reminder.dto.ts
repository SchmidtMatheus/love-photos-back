import { IsString, IsDateString, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  datetime: string;

  @IsMongoId()
  @IsNotEmpty()
  destination: string;
}
