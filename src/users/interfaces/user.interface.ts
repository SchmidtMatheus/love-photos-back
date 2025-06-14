import { Document } from 'mongoose';
import { EnumUserType } from '../enums/EnumUserType';

export interface User extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: EnumUserType;
  createdAt: Date;
  updatedAt: Date;
} 