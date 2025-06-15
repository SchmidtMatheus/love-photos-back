import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from './image-uploader.service';

@Controller('images')
export class ImageUploaderController {
  constructor(private readonly imageService: ImageUploaderService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const base64 = file.buffer.toString('base64');
    const url = await this.imageService.uploadImage(base64);
    return { imageUrl: url };
  }
}
