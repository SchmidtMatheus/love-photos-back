import { PartialType } from '@nestjs/mapped-types';
import { CreateImageUploaderDto } from './create-image-uploader.dto';

export class UpdateImageUploaderDto extends PartialType(CreateImageUploaderDto) {}
