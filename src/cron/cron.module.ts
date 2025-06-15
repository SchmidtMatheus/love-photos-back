import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { DateNotificationsService } from './date-notifications.service';
import { ImportantDate, ImportantDateSchema } from '../important-dates/schemas/important-date.schema';
import { UsersModule } from '../users/users.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: ImportantDate.name, schema: ImportantDateSchema }]),
    EmailModule,
    UsersModule,
  ],
  providers: [DateNotificationsService],
})
export class CronModule {} 