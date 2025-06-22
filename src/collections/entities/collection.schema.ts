import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CollectionDocument = Collection & Document;

@Schema({ timestamps: true })
export class Collection {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Photo' })
  coverPhotoId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Couple', required: true })
  coupleId: Types.ObjectId;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
