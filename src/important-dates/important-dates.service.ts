import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ImportantDate } from './schemas/important-date.schema';
import { CreateImportantDateDto } from './dto/create-important-date.dto';
import { UpdateImportantDateDto } from './dto/update-important-date.dto';
import { CouplesService } from 'src/couples/couples.service';

@Injectable()
export class ImportantDatesService {
  constructor(
    @InjectModel(ImportantDate.name) private importantDateModel: Model<ImportantDate>,
    private couplesService: CouplesService,
  ) {}

  async create(createImportantDateDto: CreateImportantDateDto, userId: string): Promise<ImportantDate> {
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      throw new UnauthorizedException('User does not belong to a couple');
    }

    const createdDate = new this.importantDateModel({
      ...createImportantDateDto,
      date: new Date(createImportantDateDto.date),
      destination: createImportantDateDto.destination.map(id => new Types.ObjectId(id)),
      coupleId: couple._id,
    });
    return createdDate.save();
  }

  async findAll(userId: string): Promise<ImportantDate[]> {
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      return [];
    }
    return this.importantDateModel
      .find({ coupleId: couple._id })
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
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      throw new UnauthorizedException('User does not belong to a couple');
    }

    await this.importantDateModel
      .findOneAndDelete({ 
        _id: id, 
        coupleId: couple._id
      })
      .exec();
  }
}
