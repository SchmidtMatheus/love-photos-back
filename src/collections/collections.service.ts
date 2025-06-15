import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Photo } from 'src/photos/entities/photo.schema';
import { Collection } from './entities/collection.schema';
import { PhotosService } from 'src/photos/photos.service';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name) private collectionModel: Model<Collection>,
    private photosService: PhotosService
  ) {}

  async create(data: Partial<Collection>): Promise<Collection> {
    const created = new this.collectionModel(data);
    return created.save();
  }

  async findAll(): Promise<Collection[]> {
    return this.collectionModel.find().populate('coverPhotoId').exec();
  }

  async findById(id: string): Promise<Collection> {
    const collection = await this.collectionModel
      .findById(id)
      .populate('coverPhotoId')
      .exec();
    if (!collection) {
      throw new NotFoundException('Collection not found');
    }
    return collection;
  }

  async update(id: string, data: Partial<Collection>): Promise<Collection> {
    const updated = await this.collectionModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Collection not found');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.collectionModel.findByIdAndDelete(id);
  }

  async setCoverPhoto(
    collectionId: string,
    photoId: string,
  ): Promise<Collection> {
    const photo = await this.photosService.findById(photoId);
    if (!photo || photo.collectionId.toString() !== collectionId) {
      throw new NotFoundException('Foto não pertence a esta coleção');
    }

    const updatedCollection = await this.collectionModel.findByIdAndUpdate(
      collectionId,
      { coverPhotoId: photoId },
      { new: true },
    );
    if (!updatedCollection) {
      throw new NotFoundException('Collection not found');
    }
    return updatedCollection;
  }
}
