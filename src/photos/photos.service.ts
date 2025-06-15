import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Photo, PhotoDocument } from './entities/photo.schema';

@Injectable()
export class PhotosService {
  constructor(
    @InjectModel(Photo.name) private photoModel: Model<PhotoDocument>,
  ) {}

  async create(data: Partial<Photo>): Promise<Photo> {
    const sizeInBytes = Buffer.byteLength(data.url ?? '', 'base64');
    const MAX_SIZE = 10 * 1024 * 1024;
    if (sizeInBytes > MAX_SIZE) {
      throw new BadRequestException('Imagem excede o tamanho máximo de 10MB');
    }

    const created = new this.photoModel(data);
    return created.save();
  }

  async findByCollection(collectionId: string): Promise<Photo[]> {
    return this.photoModel.find({ collectionId }).exec();
  }

  async findById(id: string): Promise<Photo | null> {
    return this.photoModel.findById(id).exec();
  }

  async delete(id: string): Promise<void> {
    await this.photoModel.findByIdAndDelete(id);
  }
}
