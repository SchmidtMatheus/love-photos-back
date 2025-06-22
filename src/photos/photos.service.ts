import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Photo, PhotoDocument } from './entities/photo.schema';
import { CollectionsService } from 'src/collections/collections.service';

@Injectable()
export class PhotosService {
  constructor(
    @InjectModel(Photo.name) private photoModel: Model<PhotoDocument>,
    private collectionsService: CollectionsService,
  ) {}

  async create(data: Partial<Photo>, userId: string): Promise<Photo> {
    const sizeInBytes = Buffer.byteLength(data.url ?? '', 'base64');
    const MAX_SIZE = 10 * 1024 * 1024;
    if (sizeInBytes > MAX_SIZE) {
      throw new BadRequestException('Image exceeds maximum size of 10MB');
    }

    if (!data.collectionId) {
      throw new BadRequestException('Collection ID is required');
    }

    // Validate that the user has access to the collection
    await this.collectionsService.findById(data.collectionId.toString(), userId);

    const created = new this.photoModel(data);
    return created.save();
  }

  async findByCollection(collectionId: string, userId: string): Promise<Photo[]> {
     // Validate that the user has access to the collection
    await this.collectionsService.findById(collectionId, userId);
    return this.photoModel.find({ collectionId }).exec();
  }

  async findById(id: string): Promise<Photo | null> {
    return this.photoModel.findById(id).exec();
  }

  async delete(id: string, userId: string): Promise<void> {
    const photo = await this.photoModel.findById(id);
    if (!photo) {
      throw new BadRequestException('Photo not found');
    }
    // Validate that the user has access to the collection this photo belongs to
    await this.collectionsService.findById(photo.collectionId.toString(), userId);
    
    await this.photoModel.findByIdAndDelete(id);
  }
}
