// src/collection/collection.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from './entities/collection.schema';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { PhotosModule } from 'src/photos/photos.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Collection.name, schema: CollectionSchema }]),
    PhotosModule
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
