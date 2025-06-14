import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ImportantDate } from './schemas/important-date.schema';
import { CreateImportantDateDto } from './dto/create-important-date.dto';
import { UpdateImportantDateDto } from './dto/update-important-date.dto';

@Injectable()
export class ImportantDatesService {
  constructor(
    @InjectModel(ImportantDate.name) private importantDateModel: Model<ImportantDate>,
  ) {}

  async create(createImportantDateDto: CreateImportantDateDto): Promise<ImportantDate> {
    const createdDate = new this.importantDateModel({
      ...createImportantDateDto,
      date: new Date(createImportantDateDto.date),
      destination: createImportantDateDto.destination.map(id => new Types.ObjectId(id))
    });
    return createdDate.save();
  }

  async findAll(userId: string): Promise<ImportantDate[]> {
    return this.importantDateModel
      .find({ destination: new Types.ObjectId(userId) })
      .populate('destination', 'name')
      .sort({ date: 1 })
      .exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} importantDate`;
  }

  update(id: number, updateImportantDateDto: UpdateImportantDateDto) {
    return `This action updates a #${id} importantDate`;
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.importantDateModel
      .findOneAndDelete({ 
        _id: id, 
        destination: new Types.ObjectId(userId) 
      })
      .exec();
  }
}
