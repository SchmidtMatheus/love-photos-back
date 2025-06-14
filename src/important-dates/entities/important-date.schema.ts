import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ImportantDateDocument = ImportantDate & Document;

@Schema({ timestamps: true })
export class ImportantDate {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  destination: Types.ObjectId[];
}

export const ImportantDateSchema = SchemaFactory.createForClass(ImportantDate);
