import { IsString, IsDate, IsMongoId } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  date: Date;

  @IsMongoId()
  createdBy: string;

  @IsMongoId()
  destination: string;
}
