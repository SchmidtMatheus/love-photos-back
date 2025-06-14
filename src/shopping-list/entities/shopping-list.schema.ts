import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ShoppingListDocument = ShoppingList & Document;

@Schema({ timestamps: true })
export class ShoppingItem {
  @Prop({ default: uuidv4 })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  quantity: string;

  @Prop({ default: false })
  checked: boolean;
}

@Schema({ timestamps: true })
export class ShoppingList {
  @Prop({ default: uuidv4 })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ type: [ShoppingItem], default: [] })
  items: ShoppingItem[];
}

export const ShoppingListSchema = SchemaFactory.createForClass(ShoppingList);
