import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ShoppingList } from './schemas/shopping-list.schema';
import { CouplesService } from '../couples/couples.service';

@Injectable()
export class ShoppingListsService {
  constructor(
    @InjectModel(ShoppingList.name) private shoppingListModel: Model<ShoppingList>,
    private couplesService: CouplesService,
  ) {}

  async create(userId: string, createShoppingListDto: { name: string; items: { name: string; quantity: string; checked: boolean }[] }) {
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      throw new Error('User is not part of a couple');
    }

    const shoppingList = new this.shoppingListModel({
      ...createShoppingListDto,
      coupleId: couple._id,
    });

    return shoppingList.save();
  }

  async findAll(userId: string) {
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      throw new Error('User is not part of a couple');
    }

    return this.shoppingListModel.find({ coupleId: couple._id }).sort({ createdAt: -1 });
  }

  async update(userId: string, id: string, updateShoppingListDto: { items: { name: string; quantity: string; checked: boolean }[] }) {
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      throw new Error('User is not part of a couple');
    }

    return this.shoppingListModel.findOneAndUpdate(
      { _id: id, coupleId: couple._id },
      { $set: { items: updateShoppingListDto.items } },
      { new: true }
    );
  }

  async remove(userId: string, id: string) {
    const couple = await this.couplesService.findByUserId(userId);
    if (!couple) {
      throw new Error('User is not part of a couple');
    }

    return this.shoppingListModel.findOneAndDelete({ _id: id, coupleId: couple._id });
  }
} 