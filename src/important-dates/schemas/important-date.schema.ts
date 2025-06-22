import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ImportantDate extends Document {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  destination: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Couple', required: true })
  coupleId: Types.ObjectId;
}

export const ImportantDateSchema = SchemaFactory.createForClass(ImportantDate); 