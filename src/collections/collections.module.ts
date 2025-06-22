// src/collection/collection.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from './entities/collection.schema';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { PhotosModule } from 'src/photos/photos.module';
import { CouplesModule } from 'src/couples/couples.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Collection.name, schema: CollectionSchema }]),
    forwardRef(() => PhotosModule),
    CouplesModule
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
