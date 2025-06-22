// src/photo/photo.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchema } from './entities/photo.schema';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { CollectionsModule } from 'src/collections/collections.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
    forwardRef(() => CollectionsModule),
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}
