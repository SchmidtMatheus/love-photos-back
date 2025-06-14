import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PhotoDocument = Photo & Document;

@Schema({ timestamps: true })
export class Photo {
  @Prop({ required: true })
  url: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Collection', required: true })
  collectionId: Types.ObjectId;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
