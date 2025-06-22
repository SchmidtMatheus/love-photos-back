import { Injectable, NotFoundException, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Photo } from 'src/photos/entities/photo.schema';
import { Collection } from './entities/collection.schema';
import { PhotosService } from 'src/photos/photos.service';
import { CouplesService } from 'src/couples/couples.service';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name) private collectionModel: Model<Collection>,
    @Inject(forwardRef(() => PhotosService))
    private photosService: PhotosService,
    private couplesService: CouplesService,
  ) {}

  async create(data: Partial<Collection>, userId: string): Promise<Collection> {
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      throw new UnauthorizedException('User does not belong to a couple');
    }
    const created = new this.collectionModel({ ...data, coupleId: couple._id });
    return created.save();
  }

  async findAll(userId: string): Promise<Collection[]> {
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      return [];
    }
    return this.collectionModel.find({ coupleId: couple._id }).populate('coverPhotoId').exec();
  }

  async findById(id: string, userId: string): Promise<Collection> {
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      throw new UnauthorizedException('User does not belong to a couple');
    }

    const collection = await this.collectionModel
      .findOne({ _id: id, coupleId: couple._id })
      .populate('coverPhotoId')
      .exec();
    if (!collection) {
      throw new NotFoundException('Collection not found or access denied');
    }
    return collection;
  }

  async update(id: string, data: Partial<Collection>, userId: string): Promise<Collection> {
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      throw new UnauthorizedException('User does not belong to a couple');
    }
    const updated = await this.collectionModel
      .findOneAndUpdate({ _id: id, coupleId: couple._id }, data, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Collection not found or access denied');
    }
    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      throw new UnauthorizedException('User does not belong to a couple');
    }
    const result = await this.collectionModel.findOneAndDelete({ _id: id, coupleId: couple._id });
    if (!result) {
      throw new NotFoundException('Collection not found or access denied');
    }
  }

  async setCoverPhoto(
    collectionId: string,
    photoId: string,
    userId: string,
  ): Promise<Collection> {
    const collection = await this.findById(collectionId, userId); // This already validates ownership

    const photo = await this.photosService.findById(photoId);
    if (!photo || photo.collectionId.toString() !== collectionId) {
      throw new NotFoundException('Photo does not belong to this collection');
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
