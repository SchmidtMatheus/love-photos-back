import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ShoppingList extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ name: String, quantity: String, checked: Boolean }], required: true })
  items: { name: string; quantity: string; checked: boolean }[];

  @Prop({ type: Types.ObjectId, ref: 'Couple', required: true })
  coupleId: Types.ObjectId;
}

export const ShoppingListSchema = SchemaFactory.createForClass(ShoppingList); 