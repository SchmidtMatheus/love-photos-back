import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { Collection } from './entities/collection.schema';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(
    @Body() body: { name: string; description: string },
  ) {
    return this.collectionsService.create({ name: body.name, description: body.description});
  }

  @Get()
  findAll() {
    return this.collectionsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.collectionsService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Collection>) {
    return this.collectionsService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.collectionsService.delete(id);
  }

  @Put(':id/cover/:photoId')
  setCover(@Param('id') id: string, @Param('photoId') photoId: string) {
    return this.collectionsService.setCoverPhoto(id, photoId);
  }
}
