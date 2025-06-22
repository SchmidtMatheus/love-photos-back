// src/important-dates/important-dates.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImportantDatesService } from './important-dates.service';
import { ImportantDatesController } from './important-dates.controller';
import { ImportantDate, ImportantDateSchema } from './schemas/important-date.schema';
import { CouplesModule } from 'src/couples/couples.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ImportantDate.name, schema: ImportantDateSchema }]),
    CouplesModule,
  ],
  controllers: [ImportantDatesController],
  providers: [ImportantDatesService],
})
export class ImportantDatesModule {}
