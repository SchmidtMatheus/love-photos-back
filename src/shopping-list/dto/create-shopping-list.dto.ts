import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateShoppingItemDto {
  @IsString()
  name: string;

  @IsString()
  quantity: string;

  checked?: boolean;
}

export class CreateShoppingListDto {
  @IsString()
  name: string;

  @IsString()
  createdBy: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShoppingItemDto)
  items: CreateShoppingItemDto[];
}
