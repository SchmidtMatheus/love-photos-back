import { Controller, Post, Body, Param, Get, Delete, UseGuards, Request } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { Photo } from './entities/photo.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('photos')
@UseGuards(JwtAuthGuard)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  create(@Body() body: Partial<Photo>, @Request() req) {
    return this.photosService.create(body, req.user.sub);
  }

  @Get('collection/:collectionId')
  findByCollection(@Param('collectionId') collectionId: string, @Request() req) {
    return this.photosService.findByCollection(collectionId, req.user.sub);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.photosService.delete(id, req.user.sub);
  }
}
