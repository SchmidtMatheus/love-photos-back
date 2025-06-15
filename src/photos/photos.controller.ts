import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { Photo } from './entities/photo.schema';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  create(@Body() body: Partial<Photo>) {
    return this.photosService.create(body);
  }

  @Get('collection/:collectionId')
  findByCollection(@Param('collectionId') collectionId: string) {
    return this.photosService.findByCollection(collectionId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.photosService.delete(id);
  }
}
