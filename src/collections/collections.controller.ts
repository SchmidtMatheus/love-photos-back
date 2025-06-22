import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { Collection } from './entities/collection.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(
    @Body() body: { name: string; description: string },
    @Request() req,
  ) {
    return this.collectionsService.create({ name: body.name, description: body.description}, req.user.sub);
  }

  @Get()
  findAll(@Request() req) {
    return this.collectionsService.findAll(req.user.sub);
  }

  @Get(':id')
  findById(@Param('id') id: string, @Request() req) {
    return this.collectionsService.findById(id, req.user.sub);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Collection>, @Request() req) {
    return this.collectionsService.update(id, body, req.user.sub);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.collectionsService.delete(id, req.user.sub);
  }

  @Put(':id/cover/:photoId')
  setCover(@Param('id') id: string, @Param('photoId') photoId: string, @Request() req) {
    return this.collectionsService.setCoverPhoto(id, photoId, req.user.sub);
  }
}
