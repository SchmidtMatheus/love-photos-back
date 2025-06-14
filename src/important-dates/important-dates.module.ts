// src/important-dates/important-dates.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImportantDatesService } from './important-dates.service';
import { ImportantDatesController } from './important-dates.controller';
import { ImportantDate, ImportantDateSchema } from './schemas/important-date.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ImportantDate.name, schema: ImportantDateSchema }])
  ],
  controllers: [ImportantDatesController],
  providers: [ImportantDatesService],
})
export class ImportantDatesModule {}
