import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Couple } from './schemas/couple.schema';

@Injectable()
export class CouplesService {
  constructor(
    @InjectModel(Couple.name) private coupleModel: Model<Couple>,
  ) {}

  async create(user1: string, user2: string): Promise<Couple> {
    const createdCouple = new this.coupleModel({
      user1: new Types.ObjectId(user1),
      user2: new Types.ObjectId(user2)
    });
    return createdCouple.save();
  }

  async findByUserId(userId: string): Promise<Couple> {
    const couple = await this.coupleModel
      .findOne({
        $or: [
          { user1: new Types.ObjectId(userId) },
          { user2: new Types.ObjectId(userId) }
        ]
      })
      .exec();

    if (!couple) {
      throw new NotFoundException('Casal não encontrado');
    }

    return couple;
  }

  async getPartnerId(userId: string): Promise<string | null> {
    const couple = await this.findByUserId(userId);
    if (!couple) return null;

    return couple.user1.toString() === userId ? couple.user2.toString() : couple.user1.toString();
  }

  async findOne(id: string) {
    return this.coupleModel.findById(id);
  }
} 